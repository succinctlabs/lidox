// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import "../src/LidoOracleV1.sol";

contract RequestUpdateScript is Script {
    function run() public {
        vm.broadcast();
        LidoOracleV1 s = LidoOracleV1(0xfD8e3773181Ca832FE0283383277a108609E3E8b);
        bytes32 blockRoot = 0x49869d23ba93a746cc8ea649a48bb6c4b2159cf3a71aef492af63dac27522c9f;
        s.requestUpdate{value: 30 gwei * 1_000_000}(blockRoot);
    }
}
