// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import "../src/SuccinctLidoOracleV1.sol";

contract Request is Script {
    function run(address oracle) public {
        vm.broadcast();
        SuccinctLidoOracleV1(oracle).requestUpdate{value: 30 gwei * 1_000_000}(6984000, 1_000_000);
    }
}
