// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../src/SuccinctLidoOracleV1.sol";
import "succinctx/mocks/MockSuccinctGateway.sol";

contract SuccinctLidoOracleV1Test is Test {
    bytes32 internal constant TEST_FUNCTION_ID = keccak256("lido function id");
    bytes32 internal constant TEST_WITHDRAWAL_CREDENTIALS = keccak256("withdrawal credentials");
    address internal immutable TEST_REQUESTER = makeAddr("requester");

    // https://sepolia.beaconcha.in/slot/0
    address internal constant BEACON_ROOTS = 0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02;
    uint256 internal constant TEST_GENESIS_TIMESTAMP = 1655733600; // sepolia genesis block timestamp
    uint64 internal constant TEST_REF_SLOT = 1000;
    uint256 internal constant TEST_REF_TIMESTAMP = TEST_GENESIS_TIMESTAMP + (TEST_REF_SLOT * 12);
    uint64 internal constant TEST_CHILD_SLOT = TEST_REF_SLOT + 1;
    uint256 internal constant TEST_CHILD_TIMESTAMP = TEST_GENESIS_TIMESTAMP + (TEST_CHILD_SLOT * 12);
    bytes32 internal constant TEST_REF_ROOT = keccak256("ref root");

    SuccinctLidoOracleV1 succinctLidoOracle;
    MockSuccinctGateway mockGateway;

    function setUp() public {
        mockGateway = new MockSuccinctGateway();

        address[] memory requesters = new address[](1);
        requesters[0] = TEST_REQUESTER;

        succinctLidoOracle = new SuccinctLidoOracleV1(
            address(mockGateway),
            TEST_FUNCTION_ID,
            TEST_WITHDRAWAL_CREDENTIALS,
            TEST_GENESIS_TIMESTAMP,
            requesters
        );

        // Return the blockroot when the pre-compiled is called with the parent timestamp.
        vm.mockCall(BEACON_ROOTS, abi.encode(TEST_CHILD_TIMESTAMP), abi.encode(TEST_REF_ROOT));
    }

    function test_Oracle() public {
        uint64 slot = TEST_REF_SLOT;
        uint64 expectedClBalanceGwei = 1000000000;
        uint32 expectedNumValidators = 1000;
        uint32 expectedExitedValidators = 12;
        uint32 callbackGasLimit = 50000;

        bytes memory input = abi.encodePacked(TEST_REF_ROOT, TEST_WITHDRAWAL_CREDENTIALS);
        bytes memory output =
            abi.encodePacked(expectedClBalanceGwei, expectedNumValidators, expectedExitedValidators);
        bytes memory context = abi.encode(slot);

        // Only requester can request proof.
        vm.expectRevert("only requester can request proof");
        succinctLidoOracle.requestUpdate(slot, callbackGasLimit);

        // Only gateway can handle callback.
        vm.expectRevert();
        succinctLidoOracle.handleUpdate(output, context);

        // Request proof and fulfill through mock gateway.
        mockGateway.loadInputOutput(input, output);
        vm.prank(TEST_REQUESTER);
        succinctLidoOracle.requestUpdate(slot, callbackGasLimit);

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
