# lido-oracle-demo

This repo implements a fully-working POC of correctly calculating the total Lido reserves, number of
validators ever deposited, and number of exited validators in ZK across all ~1M validators on Goerli
for ~200k gas.  

It is built using [plonky2x](https://github.com/succinctlabs/succinctx) proving system and deployed 
with the [Succinct SDK](https://github.com/succinctlabs/succinctx).

## Installation

To test things locally, we suggest setting `NB_VALIDATORS=1024` inside `v1.rs`. Otherwise, the 
proving times will be very long.

To run the test locally:

```
export RUST_LOG=debug
cargo test --package consensus-oracle-demo --bin v1 --release -- tests::test_circuit --exact --nocapture
```

## Contracts

To deploy the contract onchain:

```
bash script/deploy.sh
```

To send an example request to the contract:

```
bash script/request.sh
```

## Goerli Demo

Contract Address:

Request Transaction:

Fulfill Transaction:

## Security

This code has not yet been fully audited, and should not be used in any production systems.