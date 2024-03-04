# Lido X

A trustless replacement to the [Lido Accounting Oracle](https://docs.lido.fi/contracts/accounting-oracle/), powered by ZK. In particular, we calculate the following statistics every 225 epochs:

- [clBalancesGwei](https://github.com/lidofinance/lido-dao/blob/cadffa46a2b8ed6cfa1127fca2468bae1a82d6bf/contracts/0.8.9/oracle/AccountingOracle.sol#L212): cumulative balance of all Lido validators on the consensus lay
- [numValidators](https://github.com/lidofinance/lido-dao/blob/cadffa46a2b8ed6cfa1127fca2468bae1a82d6bf/contracts/0.8.9/oracle/AccountingOracle.sol#L208): the number of Lido-participating validators on consensus layer that ever appeared (deposited + activated)
- [numExitedValidators](https://github.com/lidofinance/lido-dao/blob/cadffa46a2b8ed6cfa1127fca2468bae1a82d6bf/contracts/0.8.9/oracle/AccountingOracle.sol#L222): the number of Lido-participating exited validators on the consensus layer that ever appeared

The circuit is built using the [plonky2x](https://github.com/succinctlabs/succinctx) proving system and system is deployed end-to-end
with [Succinct](alpha.succinct.xyz). You can explore the generated proofs [here](https://alpha.succinct.xyz/succinctlabs/lido-oracle-demo).

For more details, refer to the [original grant proposal](https://research.lido.fi/t/zk-lido-oracle-powered-by-succinct/5747) that was submitted to the Lido DAO.

## Installation

To run the test locally, set `CONSENSUS_RPC_URL` to a mainnet consensus node and run the following command:

```sh
RUST_LOG=debug cargo test test_circuit --release -- --nocapture
```

## Contracts

To deploy the contract onchain:

```sh
cd contracts
CHAIN=11155111 bash script/deploy.sh
```

To send an example request to the contract:

```sh
cd contracts
bash script/request.sh
```

## Operator

To run the operator:

```sh
cd operator
cp .env.example .env
yarn install
yarn build && yarn cli run <config-name>
```

Config is located at `operator/src/config.ts`

## Holesky Deployment

More details coming soon!

## Sepolia Deployment

Contract Address: [0x1527D9Ec1c94E5717e79369a0fc9dA6535f81FDe](https://sepolia.etherscan.io/address/0x1527D9Ec1c94E5717e79369a0fc9dA6535f81FDe)

Fulfill Transaction: [0xe316afe4cdb07178d1b69e7536a45decef3f85a2ae5a509fee68f3c23aa0ff13](https://sepolia.etherscan.io/tx/0xe316afe4cdb07178d1b69e7536a45decef3f85a2ae5a509fee68f3c23aa0ff13)

## Goerli Deployment

Contract Address: [0xfD8e3773181Ca832FE0283383277a108609E3E8b](https://goerli.etherscan.io/address/0xfd8e3773181ca832fe0283383277a108609e3e8b)

Fulfill Transaction: [0xf0858e2180170a3b9b7fe31f09648e2d4544590be3eaca0ca8e14c1c00d1b341](https://goerli.etherscan.io/tx/0xf0858e2180170a3b9b7fe31f09648e2d4544590be3eaca0ca8e14c1c00d1b341)

## Security

This code has not yet been fully audited, and should not be used in any production systems.
