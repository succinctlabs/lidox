# lido-oracle-demo

This repo implements a fully-working POC of correctly calculating the total Lido reserves, number of
validators ever deposited, and number of exited validators in ZK across all ~1M validators on Goerli
for ~300k gas.  

It is built using [plonky2x](https://github.com/succinctlabs/succinctx) proving system and deployed 
with the [Succinct SDK](https://github.com/succinctlabs/succinctx).

## Installation

To test things locally, we suggest setting `NB_VALIDATORS=1024` inside `v1.rs`. Otherwise, the 
proving times will be very long.

To run the test locally:

```
export RUST_LOG=debug
cargo test --package lido-oracle-demo --bin v1 --release -- tests --nocapture
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