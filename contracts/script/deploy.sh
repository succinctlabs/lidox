source ../.env

# Get correct RPC and Etherscan API key for the chain
rpc_var=$(echo 'RPC_'"${CHAIN_ID}")
rpc=$(echo $(eval echo "\$$rpc_var"))
etherscan_key_var=$(echo 'ETHERSCAN_API_KEY_'"${CHAIN_ID}")
etherscan_key=$(echo $(eval echo "\$$etherscan_key_var"))

echo "Deploying SuccinctLidoOracleV1 to $CHAIN_ID with RPC $rpc and Etherscan API key $etherscan_key"

forge script DeploySuccinctLidoOracleV1 --rpc-url $rpc --private-key $PRIVATE_KEY --broadcast --verify --verifier etherscan --etherscan-api-key $etherscan_key