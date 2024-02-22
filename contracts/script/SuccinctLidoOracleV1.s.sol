// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import "../src/SuccinctLidoOracleV1.sol";

contract DeploySuccinctLidoOracleV1 is Script {
    function run() public returns (address) {
        vm.broadcast();

        address SUCCINCT_GATEWAY = 0x6c7a05e0AE641c6559fD76ac56641778B6eCd776;

        // https://alpha.succinct.xyz/lidofinance/lidox/deployments
        bytes32 FUNCTION_ID = 0xf7a148777561414610fb93d42715af696b0e10b4f7f79d27d00fa883eb44a85f;

        // Chain specific constants can be found at:
        // https://github.com/lidofinance/docs/blob/main/docs/deployed-contracts/index.md
        bytes32 LIDO_WITHDRAWAL_CREDENTIAL;
        uint256 GENESIS_BLOCK_TIMESTAMP;
        if (block.chainid == 1) {
            LIDO_WITHDRAWAL_CREDENTIAL =
                0x010000000000000000000000b9d7934878b5fb9610b3fe8a5e441e8fad7e293f;
            GENESIS_BLOCK_TIMESTAMP = 1606824023;
        } else if (block.chainid == 5) {
            LIDO_WITHDRAWAL_CREDENTIAL =
                0x010000000000000000000000dc62f9e8C34be08501Cdef4EBDE0a280f576D762;
            GENESIS_BLOCK_TIMESTAMP = 1616508000;
        } else if (block.chainid == 11155111) {
            LIDO_WITHDRAWAL_CREDENTIAL =
                0x010000000000000000000000De7318Afa67eaD6d6bbC8224dfCe5ed6e4b86d76;
            GENESIS_BLOCK_TIMESTAMP = 1655733600;
        } else if (block.chainid == 17000) {
            LIDO_WITHDRAWAL_CREDENTIAL =
                0x010000000000000000000000F0179dEC45a37423EAD4FaD5fCb136197872EAd9;
            GENESIS_BLOCK_TIMESTAMP = 1695902400;
        } else {
            revert("unsupported chainid");
        }

        address[] memory REQUESTERS = new address[](1);
        REQUESTERS[0] = msg.sender;

        SuccinctLidoOracleV1 oracle = new SuccinctLidoOracleV1(
            SUCCINCT_GATEWAY,
            FUNCTION_ID,
            LIDO_WITHDRAWAL_CREDENTIAL,
            GENESIS_BLOCK_TIMESTAMP,
            REQUESTERS
        );

        return address(oracle);
    }
}
