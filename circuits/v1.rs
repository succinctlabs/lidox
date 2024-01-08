//! A demo of how the Succinct SDK can be used to augment the security of the Lido Oracle.
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
#![feature(async_fn_in_trait)]

use log::debug;
use plonky2::plonk::config::{AlgebraicHasher, GenericConfig};
use plonky2x::backend::circuit::{Circuit, PlonkParameters};
use plonky2x::backend::function::Plonky2xFunction;
use plonky2x::frontend::eth::beacon::generators::{
    BeaconPartialBalancesHint, BeaconPartialValidatorsHint,
};
use plonky2x::frontend::eth::beacon::vars::BeaconBalancesVariable;
use plonky2x::frontend::hash::poseidon::poseidon256::PoseidonHashOutVariable;
use plonky2x::frontend::mapreduce::generator::{MapReduceDynamicGenerator, MapReduceGenerator};
use plonky2x::frontend::uint::uint64::U64Variable;
use plonky2x::frontend::vars::{CircuitVariable, SSZVariable, U256Variable, U32Variable};
use plonky2x::prelude::{Bytes32Variable, CircuitBuilder, HintRegistry};

mod builder;

use builder::{
    BeaconValidatorSubtreeHint, BeaconValidatorSubtreePoseidonHint, BeaconValidatorSubtreesHint,
    LidoBuilderMethods,
};

/// The number of slots per epoch in the consensus layer.
const SLOTS_PER_EPOCH: u64 = 32;

/// The batch size for building the validator tree and computing numValidators.
const VALIDATOR_BATCH_SIZE: usize = 512;

/// The batch size for building the balance tree and computing clBalancesGwei and numExitedValidators.
const BALANCE_BATCH_SIZE: usize = 16384;

/// The number of validators to fetch.
const NB_VALIDATORS: usize = 32768;

#[derive(Debug, Clone)]
struct LidoOracleV1<const V: usize, const B: usize, const N: usize>;

impl<const V: usize, const B: usize, const N: usize> Circuit for LidoOracleV1<V, B, N> {
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
        let subtrees = builder.beacon_witness_validator_subtrees::<V, N>(block_root);

        debug!("starting 1");
        let validator_output = builder.mapreduce_dynamic::<Bytes32Variable, Bytes32Variable, (
            PoseidonHashOutVariable,
            Bytes32Variable,
            U32Variable,
            //     poseidon_acc,
            //     validators_root,
            //     num_validators,
        ), Self, 1, _, _>(
            withdrawal_credentials,
            subtrees,
            |withdrawal_credentials, hashes, builder| {
                // Witness validators.
                builder.watch(&hashes[0], "hashes[0]");
                let subtree_hash = hashes[0];
                let validators = builder.beacon_witness_validator_subtree::<V, N>(subtree_hash);
                // Compute the SSZ leaf representation of the validators.
                // Compute whether the validator matches the provided withdrawal credentials and
                // satisfies validator.activation_epoch <= epoch < validator.exit_epoch.
                let mut validator_leafs = Vec::new();
                let one = builder.one::<U32Variable>();
                let mut num_validators = builder.zero::<U32Variable>();
                let mut acc_leaves = Vec::new();
                for i in 0..validators.len() {
                    let validator_root = validators[i].hash_tree_root(builder);
                    validator_leafs.push(validator_root);

                    // Compute validator.withdrawal_credentials == withdrawal_credentials.
                    // builder.watch(
                    //     &validators[i].withdrawal_credentials,
                    //     format!("withdrawal_credentials_{}", i).as_str(),
                    // );
                    let withdrawal_credentials_match = builder
                        .is_equal(validators[i].withdrawal_credentials, withdrawal_credentials);
                    acc_leaves.push((withdrawal_credentials_match, validators[i].exit_epoch));

                    // Add to the total validator count.
                    let num_validators_plus_one = builder.add(num_validators, one);
                    num_validators = builder.select(
                        withdrawal_credentials_match,
                        num_validators_plus_one,
                        num_validators,
                    );
                }

                let computed_subtree_hash = builder.ssz_hash_leafs(&validator_leafs);
                builder.watch(&computed_subtree_hash, "computed_subtree_hash");
                builder.watch(&subtree_hash, "subtree_hash");
                builder.assert_is_equal(computed_subtree_hash, subtree_hash);

                let poseidon_hash = builder.poseidon_hash(
                    &acc_leaves
                        .iter()
                        .flat_map(|v| v.0.variables())
                        .collect::<Vec<_>>(),
                );
                // let mut poseidons = acc_leaves
                //     .iter()
                //     .map(|v| builder.poseidon_hash(&v.variables()))
                //     .collect::<Vec<_>>();
                // while poseidons.len() > 1 {
                //     let mut new_poseidons = Vec::new();
                //     for i in 0..poseidons.len() / 2 {
                //         let (left, right) =
                //             (poseidons[i * 2].clone(), poseidons[i * 2 + 1].clone());
                //         new_poseidons.push(builder.poseidon_hash_pair(left, right));
                //     }
                //     poseidons = new_poseidons;
                // }
                (poseidon_hash.clone(), subtree_hash, num_validators)
            },
            |_, left, right, builder| {
                builder.watch(&left.1, "left.0");
                (
                    builder.poseidon_hash_pair(left.0, right.0),
                    builder.sha256_pair(left.1, right.1),
                    builder.add(left.2, right.2),
                )
            },
        );
        debug!("done 1");

        builder.watch(&validator_output.0, "val output1");
        builder.watch(&validator_output.1, "val output2");
        builder.watch(&validator_output.2, "val output3");

        // balances, epoch, withdrawal_credentials
        // indexes
        // poseidon_acc, balance_root, cl_balances_gwei, num_exited_validators
        let idxs = (0..N).map(|i| i as u64).step_by(B).collect::<Vec<_>>();
        debug!("idxs: {:?}", idxs);
        debug!("starting 2");
        let balance_output = builder
            .mapreduce::<(BeaconBalancesVariable, U256Variable, Bytes32Variable), U64Variable, (
                PoseidonHashOutVariable,
                Bytes32Variable,
                U64Variable,
                U32Variable,
            ), Self, 1, _, _>(
                (balances, epoch, withdrawal_credentials),
                idxs,
                |(balances, epoch, withdrawal_credentials), idxs, builder| {
                    builder.watch(&idxs[0], "idxs[0]");
                    // Witness balances.
                    debug!("a");
                    let balances_witness =
                        builder.beacon_witness_balance_batch::<B>(balances, idxs[0]);
                    let poseidon_leaves = builder.beacon_witness_validator_subtree_poseidon::<B>(
                        balances.block_root,
                        withdrawal_credentials,
                        idxs[0],
                    );
                    debug!("b");

                    // Convert balances to leafs.
                    let mut balance_leafs = Vec::new();
                    let zero = builder.zero::<U64Variable>();
                    let mut cl_balances_gwei = builder.zero::<U64Variable>();
                    for i in 0..B / 4 {
                        let four_balances = [
                            balances_witness[i * 4],
                            balances_witness[i * 4 + 1],
                            balances_witness[i * 4 + 2],
                            balances_witness[i * 4 + 3],
                        ];
                        let masked_balances = [
                            builder.select(poseidon_leaves[i * 4].0, four_balances[0], zero),
                            builder.select(poseidon_leaves[i * 4 + 1].0, four_balances[1], zero),
                            builder.select(poseidon_leaves[i * 4 + 2].0, four_balances[2], zero),
                            builder.select(poseidon_leaves[i * 4 + 3].0, four_balances[3], zero),
                        ];
                        let cl_balances_gwei_term = builder.add_many(&masked_balances);
                        cl_balances_gwei = builder.add(cl_balances_gwei, cl_balances_gwei_term);
                        balance_leafs.push(builder.beacon_u64s_to_leaf(four_balances));
                    }
                    debug!("c");

                    // Hash in batches of B.
                    let mut poseidons = poseidon_leaves
                        .chunks(B)
                        .map(|b| {
                            builder.poseidon_hash(
                                &b.iter().flat_map(|v| v.variables()).collect::<Vec<_>>(),
                            )
                        })
                        .collect::<Vec<_>>();
                    // let mut poseidons =
                    // let mut poseidons = poseidon_leaves
                    //     .iter()
                    //     .map(|v| builder.poseidon_hash(&v.variables()))
                    //     .collect::<Vec<_>>();
                    while poseidons.len() > 1 {
                        let mut new_poseidons = Vec::new();
                        for i in 0..poseidons.len() / 2 {
                            let (left, right) =
                                (poseidons[i * 2].clone(), poseidons[i * 2 + 1].clone());
                            new_poseidons.push(builder.poseidon_hash_pair(left, right));
                        }
                        poseidons = new_poseidons;
                    }
                    debug!("balance_leafs.len(): {}", balance_leafs.len());

                    // Reduce validator leafs to a single root.
                    let balances_root = builder.ssz_hash_leafs(&balance_leafs);

                    let one = builder.one::<U32Variable>();
                    let mut num_exited_validators = builder.zero::<U32Variable>();
                    debug!("leaves_len: {}", poseidon_leaves.len());
                    builder.watch(&epoch, "epoch");
                    for i in 0..poseidon_leaves.len() {
                        let (withdrawal_credentials_match, exit_epoch) = poseidon_leaves[i];
                        let is_exited_validator = builder.gte(epoch, exit_epoch);
                        let is_exited_validator =
                            builder.and(withdrawal_credentials_match, is_exited_validator);
                        let num_exited_validators_plus_one =
                            builder.add(num_exited_validators, one);
                        num_exited_validators = builder.select(
                            is_exited_validator,
                            num_exited_validators_plus_one,
                            num_exited_validators,
                        );
                    }
                    debug!("e");

                    // Return the partial roots and statistics.
                    (
                        poseidons[0].clone(),
                        balances_root,
                        cl_balances_gwei,
                        num_exited_validators,
                    )
                },
                |_, left, right, builder| {
                    (
                        builder.poseidon_hash_pair(left.0, right.0),
                        builder.sha256_pair(left.1, right.1),
                        builder.add(left.2, right.2),
                        builder.add(left.3, right.3),
                    )
                },
            );
        debug!("done 2");

        // builder.watch(&balance_output.0, "bal output1");
        builder.watch(&balance_output.1, "bal output2");
        builder.watch(&balance_output.2, "bal output3");
        builder.watch(&balance_output.3, "bal output4");

        // Assert that the reconstructed commitments match to what we proved exists in the block.
        builder.assert_is_equal(validator_output.0, balance_output.0);
        builder.assert_is_equal(validator_output.1, validators.validators_root);
        builder.assert_is_equal(balance_output.1, balances.root);

        // Write outputs back to the EVM.
        builder.evm_write::<U64Variable>(balance_output.2);
        builder.evm_write::<U32Variable>(validator_output.2);
        builder.evm_write::<U32Variable>(balance_output.3);
    }

    fn register_generators<L: PlonkParameters<D>, const D: usize>(registry: &mut HintRegistry<L, D>)
    where
        <<L as PlonkParameters<D>>::Config as GenericConfig<D>>::Hasher: AlgebraicHasher<L::Field>,
    {
        let dynamic_id = MapReduceDynamicGenerator::<L, (), (), (), Self, 1, D>::id();
        registry.register_simple::<MapReduceDynamicGenerator<
            L,
            Bytes32Variable,
            Bytes32Variable,
            (PoseidonHashOutVariable, Bytes32Variable, U32Variable),
            Self,
            1,
            D,
        >>(dynamic_id);
        let id = MapReduceGenerator::<L, (), (), (), Self, 1, D>::id();
        registry.register_simple::<MapReduceGenerator<
            L,
            (BeaconBalancesVariable, U256Variable, Bytes32Variable),
            U64Variable,
            (
                PoseidonHashOutVariable,
                Bytes32Variable,
                U64Variable,
                U32Variable,
            ),
            Self,
            1,
            D,
        >>(id);
        if N > usize::pow(2, 21) {
            registry.register_async_hint::<BeaconPartialValidatorsHint<N>>();
            registry.register_async_hint::<BeaconPartialBalancesHint<N>>();
        }
        registry.register_async_hint::<BeaconValidatorSubtreeHint<V, N>>();
        registry.register_async_hint::<BeaconValidatorSubtreesHint<V, N>>();
        registry.register_async_hint::<BeaconValidatorSubtreePoseidonHint<B>>();
    }
}

fn main() {
    LidoOracleV1::<VALIDATOR_BATCH_SIZE, BALANCE_BATCH_SIZE, NB_VALIDATORS>::entrypoint();
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

    const TEST_V: usize = 2;
    const TEST_B: usize = 4;
    const TEST_NB_VALIDATORS: usize = 16;

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
        debug!("TEST_B: {}", TEST_B);
        debug!("TEST_NB_VALIDATORS: {}", TEST_NB_VALIDATORS);
        let mut builder = CircuitBuilder::<L, D>::new();
        LidoOracleV1::<TEST_V, TEST_B, TEST_NB_VALIDATORS>::define(&mut builder);
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
        // assert_eq!(cl_balances_gwei, 12804421770945);
        // assert_eq!(num_validators, 400);
        // assert_eq!(num_exited_validators, 0);

        // Test circuit serialization.
        LidoOracleV1::<TEST_V, TEST_B, TEST_NB_VALIDATORS>::test_serialization::<L, D>();
    }
}
