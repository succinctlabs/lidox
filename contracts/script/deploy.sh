source ../.env
forge create src/LidoOracleV1.sol:LidoOracleV1 \
    --rpc-url $RPC_5 \
    --private-key $PRIVATE_KEY \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_5