# lido-oracle-demo

This repo implements a fully-working POC of correctly calculating the total Lido reserves, number of
validators ever deposited, and number of exited validators in ZK across all ~2M validators
for ~300k gas.

It is built using [plonky2x](https://github.com/succinctlabs/succinctx) proving system and deployed
with the [Succinct SDK](https://github.com/succinctlabs/succinctx).

## Circuit Logic

1. From the input beacon block root, prove the validator and balance tree roots.
   - Note: we actually prove a subset of the full trees because most of the values are zero.
2. In a mapreduce-like system:
   1. Map the validators into batches of 512, and for each batch, calculate the total balances, validators, and exited validators. Additionally, compute the merkle hashes of this batch's balances and validators within the full validator tree.
   2. Reduce the batch roots in pairs to form a single validator root and single balance root.
3. Confirm that the resulting validator and balance root are correct.
4. Output the result data.

## Installation

To run the test locally:

```
RUST_LOG=debug cargo test test_circuit --release -- --nocapture
```

## Contracts

To deploy the contract onchain:

```
cd contracts
bash script/deploy.sh
```

To send an example request to the contract:

```
cd contracts
bash script/request.sh
```

## Goerli Demo

Contract Address: [0xfD8e3773181Ca832FE0283383277a108609E3E8b](https://goerli.etherscan.io/address/0xfd8e3773181ca832fe0283383277a108609e3e8b)

Fulfill Transaction: [0xf0858e2180170a3b9b7fe31f09648e2d4544590be3eaca0ca8e14c1c00d1b341](https://goerli.etherscan.io/tx/0xf0858e2180170a3b9b7fe31f09648e2d4544590be3eaca0ca8e14c1c00d1b341)

## Security

This code has not yet been fully audited, and should not be used in any production systems.
