source ../.env
forge script Request \
    --sig "run(address)" $ORACLE_ADDRESS \
    --rpc-url $RPC_11155111 \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --skip-simulation \
    --gas-limit 500000
