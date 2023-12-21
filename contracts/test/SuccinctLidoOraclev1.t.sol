// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../src/SuccinctLidoOracleV1.sol";
import "succinctx/mocks/MockSuccinctGateway.sol";

contract SuccinctLidoOracleV1Test is Test {
    SuccinctLidoOracleV1 succinctLidoOracle;
    MockSuccinctGateway mockGateway;

    bytes32 constant TEST_FUNCTION_ID = keccak256("lido function id");
    bytes32 constant TEST_WITHDRAWAL_CREDENTIALS = keccak256("withdrawal credentials");
    address immutable TEST_REQUESTER = makeAddr("requester");

    function setUp() public {
        mockGateway = new MockSuccinctGateway();
        succinctLidoOracle = new SuccinctLidoOracleV1(
            address(mockGateway), TEST_FUNCTION_ID, TEST_WITHDRAWAL_CREDENTIALS, TEST_REQUESTER
        );
    }

    function testOracle(
        bytes32 blockRoot,
        uint64 slot,
        uint64 expectedClBalanceGwei,
        uint32 expectedNumValidators,
        uint32 expectedExitedValidators
    ) public {
        uint32 callbackGasLimit = 50000;

        bytes memory input = abi.encodePacked(blockRoot, TEST_WITHDRAWAL_CREDENTIALS);
        bytes memory output =
            abi.encodePacked(expectedClBalanceGwei, expectedNumValidators, expectedExitedValidators);
        bytes memory context = abi.encode(slot);

        // Only requester can request proof.
        vm.expectRevert("only requester can request proof");
        succinctLidoOracle.requestUpdate(blockRoot, slot, callbackGasLimit);

        // Only gateway can handle callback.
        vm.expectRevert();
        succinctLidoOracle.handleUpdate(output, context);

        // Request proof and fulfill through mock gateway.
        mockGateway.loadInputOutput(input, output);
        vm.prank(TEST_REQUESTER);
        succinctLidoOracle.requestUpdate(blockRoot, slot, callbackGasLimit);

        // Verify expected output.
        (
            bool requested,
            bool received,
            uint64 clBalanceGwei,
            uint32 numValidators,
            uint32 exitedValidators
        ) = succinctLidoOracle.reports(slot);
        assertEq(requested, true);
        assertEq(received, true);
        assertEq(clBalanceGwei, expectedClBalanceGwei);
        assertEq(numValidators, expectedNumValidators);
        assertEq(exitedValidators, expectedExitedValidators);
    }
}
