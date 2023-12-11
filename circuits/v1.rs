//! A demo of how the Succinct SDK can be used to augment the security of the Lido Oralce.
//!
//! This circuit calculates the following for a given `beaconBlockRoot` and `withdrawalCredentials`:
//!
//! 1) clBalancesGwei: the total sum of balances for valiators that their withdrawal credentials
//! pointed to the provided withdrawal credentials `withdrawalCredentials`.
//!
//! 2) numValidators: the number of active validators that have ever deposited to the consensus
//! layer with their withdrawal credentials pointed to the provided withdrawal credentials.
//!
//! 3) numExitedValidators: the number of exited validators that their withdrawal credentials
//! pointed to the provided withdrawal credentials and satisfy epoch >= exitEpoch.
//!
//! Note that using the withdrawal credentials as a filter is not secure as acknowledged in this
//! thread: https://research.lido.fi/t/zkllvm-trustless-zk-proof-tvl-oracle/5028/8.
#![allow(clippy::needless_range_loop)]

use itertools::Itertools;
use plonky2::plonk::config::{AlgebraicHasher, GenericConfig};
use plonky2x::backend::circuit::{Circuit, PlonkParameters};
use plonky2x::backend::function::Plonky2xFunction;
use plonky2x::frontend::eth::beacon::vars::{BeaconBalancesVariable, BeaconValidatorsVariable};
use plonky2x::frontend::mapreduce::generator::MapReduceGenerator;
use plonky2x::frontend::uint::uint64::U64Variable;
use plonky2x::frontend::vars::{SSZVariable, U256Variable, U32Variable};
use plonky2x::prelude::{Bytes32Variable, CircuitBuilder, HintRegistry};

/// The number of slots per epoch in the consensus layer.
const SLOTS_PER_EPOCH: u64 = 32;

/// The number of validators to fetch.
const NB_VALIDATORS: usize = 2097152;

/// The batch size for fetching balances and computing the local balance roots.
const BATCH_SIZE: usize = 512;

#[derive(Debug, Clone)]
struct LidoOracleV1<const N: usize>;

impl<const N: usize> Circuit for LidoOracleV1<N> {
    fn define<L: PlonkParameters<D>, const D: usize>(builder: &mut CircuitBuilder<L, D>)
    where
        <<L as PlonkParameters<D>>::Config as GenericConfig<D>>::Hasher:
            AlgebraicHasher<<L as PlonkParameters<D>>::Field>,
    {
        // Read the block root and withdrawal credentials from the EVM.
        let block_root = builder.evm_read::<Bytes32Variable>();
        let withdrawal_credentials = builder.evm_read::<Bytes32Variable>();

        // Get the corresponding header, slot, and epoch.
        let header = builder.beacon_get_block_header(block_root);
        let slot = header.slot;
        let slots_per_epoch = builder.constant::<U64Variable>(SLOTS_PER_EPOCH);
        let epoch = builder.div(slot, slots_per_epoch).to_u256(builder);

        // Get the validators and balances root.
        let validators = builder.beacon_get_partial_validators::<N>(block_root);
        let balances = builder.beacon_get_partial_balances::<N>(block_root);
        let idxs = (0..N).map(|i| i as u64).collect_vec();

        let output = builder.mapreduce::<(
            BeaconValidatorsVariable,
            BeaconBalancesVariable,
            U256Variable,
            Bytes32Variable,
        ), U64Variable, (
            Bytes32Variable,
            Bytes32Variable,
            U64Variable,
            U32Variable,
            U32Variable,
        ), Self, BATCH_SIZE, _, _>(
            (validators, balances, epoch, withdrawal_credentials),
            idxs,
            |(validators, balances, epoch, withdrawal_credentials), idxs, builder| {
                // Witness validators.
                let validators =
                    builder.beacon_witness_validator_batch::<BATCH_SIZE>(validators, idxs[0]);

                // Witness balances.
                let balances =
                    builder.beacon_witness_balance_batch::<BATCH_SIZE>(balances, idxs[0]);

                // Compute the SSZ leaf representation of the validators.
                let mut validator_leafs = Vec::new();
                for i in 0..validators.len() {
                    let validator_root = validators[i].hash_tree_root(builder);
                    validator_leafs.push(validator_root);
                }

                // Compute whether the validator matches the provided withdrawal credentials and
                // satisfies validator.activation_epoch <= epoch < validator.exit_epoch.
                let one = builder.one::<U32Variable>();
                let mut num_validators = builder.zero::<U32Variable>();
                let mut num_exited_validators = builder.zero::<U32Variable>();
                let mut mask = Vec::new();
                for i in 0..validators.len() {
                    // Compute validator.withdrawal_credentials == withdrawal_credentials.
                    let withdrawal_credentials_match = builder
                        .is_equal(validators[i].withdrawal_credentials, withdrawal_credentials);
                    mask.push(withdrawal_credentials_match);

                    // Add to the total validator count.
                    let num_validators_plus_one = builder.add(num_validators, one);
                    num_validators = builder.select(
                        withdrawal_credentials_match,
                        num_validators_plus_one,
                        num_validators,
                    );

                    // Check whether it is an exited validator. If it is, add to the
                    // total exited validator count.
                    let is_exited_validator = builder.gte(epoch, validators[i].exit_epoch);
                    let is_exited_validator =
                        builder.and(withdrawal_credentials_match, is_exited_validator);
                    let num_exited_validators_plus_one = builder.add(num_exited_validators, one);
                    num_exited_validators = builder.select(
                        is_exited_validator,
                        num_exited_validators_plus_one,
                        num_exited_validators,
                    );
                }

                // Convert balances to leafs.
                let mut balance_leafs = Vec::new();
                let zero = builder.zero::<U64Variable>();
                let mut cl_balances_gwei = builder.zero::<U64Variable>();
                for i in 0..idxs.len() / 4 {
                    let balances = [
                        balances[i * 4],
                        balances[i * 4 + 1],
                        balances[i * 4 + 2],
                        balances[i * 4 + 3],
                    ];
                    let masked_balances = [
                        builder.select(mask[i * 4], balances[0], zero),
                        builder.select(mask[i * 4 + 1], balances[1], zero),
                        builder.select(mask[i * 4 + 2], balances[2], zero),
                        builder.select(mask[i * 4 + 3], balances[3], zero),
                    ];
                    let cl_balances_gwei_term = builder.add_many(&masked_balances);
                    cl_balances_gwei = builder.add(cl_balances_gwei, cl_balances_gwei_term);
                    balance_leafs.push(builder.beacon_u64s_to_leaf(balances));
                }

                // Reduce validator leafs to a single root.
                let validators_root = builder.ssz_hash_leafs(&validator_leafs);
                let balances_root = builder.ssz_hash_leafs(&balance_leafs);

                // Return the parial roots and statistics.
                (
                    validators_root,
                    balances_root,
                    cl_balances_gwei,
                    num_validators,
                    num_exited_validators,
                )
            },
            |_, left, right, builder| {
                (
                    builder.sha256_pair(left.0, right.0),
                    builder.sha256_pair(left.1, right.1),
                    builder.add(left.2, right.2),
                    builder.add(left.3, right.3),
                    builder.add(left.4, right.4),
                )
            },
        );

        // Assert that the reconstructed commitments match to what we proved exists in the block.
        builder.assert_is_equal(output.0, validators.validators_root);
        builder.assert_is_equal(output.1, balances.root);

        // Write outputs back to the EVM.
        builder.evm_write::<U64Variable>(output.2);
        builder.evm_write::<U32Variable>(output.3);
        builder.evm_write::<U32Variable>(output.4);
    }

    fn register_generators<L: PlonkParameters<D>, const D: usize>(registry: &mut HintRegistry<L, D>)
    where
        <<L as PlonkParameters<D>>::Config as GenericConfig<D>>::Hasher: AlgebraicHasher<L::Field>,
    {
        let id = MapReduceGenerator::<
            L,
            (
                BeaconValidatorsVariable,
                BeaconBalancesVariable,
                U256Variable,
                Bytes32Variable,
            ),
            U64Variable,
            (
                Bytes32Variable,
                Bytes32Variable,
                U64Variable,
                U32Variable,
                U32Variable,
            ),
            Self,
            BATCH_SIZE,
            D,
        >::id();
        registry.register_simple::<MapReduceGenerator<
            L,
            (
                BeaconValidatorsVariable,
                BeaconBalancesVariable,
                U256Variable,
                Bytes32Variable,
            ),
            U64Variable,
            (
                Bytes32Variable,
                Bytes32Variable,
                U64Variable,
                U32Variable,
                U32Variable,
            ),
            Self,
            BATCH_SIZE,
            D,
        >>(id);
    }
}

fn main() {
    LidoOracleV1::<NB_VALIDATORS>::entrypoint();
}

#[cfg(test)]
mod tests {
    use log::debug;
    use plonky2x::prelude::DefaultParameters;
    use plonky2x::utils::bytes32;

    use super::*;

    type L = DefaultParameters;
    const D: usize = 2;

    /// An example source block root (mainnet slot 7959300).
    const BLOCK_ROOT: &str = "0x46da8a07811bd86a9430d8d188afc39e19e84414df6c82ac99a31a94d556d5f4";

    /// Test withdrawal credentials, used by 400 of the first 1024 mainnet validators.
    const WITHDRAWAL_CREDENTIALS: &str =
        "0x010000000000000000000000f4d1645dd1a8a44a3dd197cba2626161b01163c5";

    const TEST_NB_VALIDATORS: usize = 1024;

    /// A test of the circuit on slot 7959300.
    ///
    /// The expected outputs were calculated from the original lido-oracle repo from [1].
    ///
    /// [1]: https://research.lido.fi/t/zkllvm-trustless-zk-proof-tvl-oracle/5028/9
    #[test]
    fn test_circuit() {
        env_logger::try_init().unwrap_or_default();
        dotenv::dotenv().ok();

        // Build the circuit.
        debug!("TEST_NB_VALIDATORS: {}", TEST_NB_VALIDATORS);
        let mut builder = CircuitBuilder::<L, D>::new();
        LidoOracleV1::<TEST_NB_VALIDATORS>::define(&mut builder);
        let circuit = builder.build();

        // Generate input.
        let mut input = circuit.input();
        input.evm_write::<Bytes32Variable>(bytes32!(BLOCK_ROOT));
        input.evm_write::<Bytes32Variable>(bytes32!(WITHDRAWAL_CREDENTIALS));

        // Generate the proof and verify.
        let (proof, mut output) = circuit.prove(&input);
        circuit.verify(&proof, &input, &output);

        // Read output.
        let cl_balances_gwei = output.evm_read::<U64Variable>();
        let num_validators = output.evm_read::<U32Variable>();
        let num_exited_validators = output.evm_read::<U32Variable>();
        debug!("oracle report");
        debug!("> clBalancesGwei: {}", cl_balances_gwei);
        debug!("> numValidators: {}", num_validators);
        debug!("> numExitedValidators: {}", num_exited_validators);

        // Assert output.
        assert_eq!(cl_balances_gwei, 12804421770945);
        assert_eq!(num_validators, 400);
        assert_eq!(num_exited_validators, 0);

        // Test circuit serialization.
        LidoOracleV1::<TEST_NB_VALIDATORS>::test_serialization::<L, D>();
    }
}
