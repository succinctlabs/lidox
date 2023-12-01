// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";
import "../src/SuccinctLidoOracleV1.sol";

contract DeployScript is Script {
    function run() public {
        vm.broadcast();
        SuccinctLidoOracleV1 s = SuccinctLidoOracleV1(0xfD8e3773181Ca832FE0283383277a108609E3E8b);
        s.requestUpdate{value: 30 gwei * 1_000_000}(
            0x49869d23ba93a746cc8ea649a48bb6c4b2159cf3a71aef492af63dac27522c9f, 6984000, 1_000_000
        );
    }
}
