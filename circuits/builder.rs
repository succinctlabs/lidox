use std::env;

use async_trait::async_trait;
use plonky2x::backend::circuit::PlonkParameters;
use plonky2x::frontend::builder::CircuitBuilder;
use plonky2x::frontend::eth::beacon::vars::BeaconValidatorVariable;
use plonky2x::frontend::hint::asynchronous::hint::AsyncHint;
use plonky2x::frontend::vars::{Bytes32Variable, ValueStream, VariableStream};
use plonky2x::utils::eth::beacon::BeaconClient;
use plonky2x::utils::{bytes32, hex};
use serde::{Deserialize, Serialize};

pub trait LidoBuilderMethods<L: PlonkParameters<D>, const D: usize> {
    fn beacon_witness_validator_subtrees<const B: usize, const N: usize>(
        &mut self,
        block_root: Bytes32Variable,
    ) -> Vec<Bytes32Variable>;

    fn beacon_witness_validator_subtree<const B: usize, const N: usize>(
        &mut self,
        subtree_hash: Bytes32Variable,
    ) -> Vec<BeaconValidatorVariable>;
}

impl<L: PlonkParameters<D>, const D: usize> LidoBuilderMethods<L, D> for CircuitBuilder<L, D> {
    fn beacon_witness_validator_subtrees<const B: usize, const N: usize>(
        &mut self,
        block_root: Bytes32Variable,
    ) -> Vec<Bytes32Variable> {
        let mut input_stream = VariableStream::new();
        input_stream.write::<Bytes32Variable>(&block_root);
        let hint = BeaconValidatorSubtreesHint::<B, N> {};
        let output_stream = self.async_hint(input_stream, hint);
        let num_batches = N / B;
        let mut subtrees = Vec::new();
        for i in 0..num_batches {
            let batch = output_stream.read::<Bytes32Variable>(self);
            subtrees.push(batch);
        }
        subtrees
    }

    fn beacon_witness_validator_subtree<const B: usize, const N: usize>(
        &mut self,
        subtree_hash: Bytes32Variable,
    ) -> Vec<BeaconValidatorVariable> {
        let mut input_stream = VariableStream::new();
        input_stream.write::<Bytes32Variable>(&subtree_hash);
        let hint = BeaconValidatorSubtreeHint::<B, N> {};
        let output_stream = self.async_hint(input_stream, hint);
        let num_batches = N / B;
        let mut subtrees = Vec::new();
        for i in 0..num_batches {
            let batch = output_stream.read::<BeaconValidatorVariable>(self);
            subtrees.push(batch);
        }
        subtrees
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BeaconValidatorSubtreesHint<const B: usize, const N: usize> {}

#[async_trait]
impl<L: PlonkParameters<D>, const D: usize, const B: usize, const N: usize> AsyncHint<L, D>
    for BeaconValidatorSubtreesHint<B, N>
{
    async fn hint(
        &self,
        input_stream: &mut ValueStream<L, D>,
        output_stream: &mut ValueStream<L, D>,
    ) {
        let client = BeaconClient::new(env::var("CONSENSUS_RPC_URL").unwrap());
        let block_root = input_stream.read_value::<Bytes32Variable>();

        let response = client
            .get_validator_subtrees(B, N, hex!(block_root))
            .await
            .expect("failed to get validators root");

        for i in 0..N / B {
            output_stream.write_value::<Bytes32Variable>(bytes32!(response[i]));
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BeaconValidatorSubtreeHint<const B: usize, const N: usize> {}

#[async_trait]
impl<L: PlonkParameters<D>, const D: usize, const B: usize, const N: usize> AsyncHint<L, D>
    for BeaconValidatorSubtreeHint<B, N>
{
    async fn hint(
        &self,
        input_stream: &mut ValueStream<L, D>,
        output_stream: &mut ValueStream<L, D>,
    ) {
        let client = BeaconClient::new(env::var("CONSENSUS_RPC_URL").unwrap());
        let block_root = input_stream.read_value::<Bytes32Variable>();

        let response = client
            .get_validator_subtree(B, N, hex!(block_root))
            .await
            .expect("failed to get validators root");

        for i in 0..N / B {
            output_stream.write_value::<BeaconValidatorVariable>(response[i]);
        }
    }
}
