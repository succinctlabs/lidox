// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./interfaces/ISuccinctGateway.sol";
import "./interfaces/LidoZKOracle.sol";

/// @title SuccinctLidoOracleV1
/// @notice A demo of how the Succinct SDK can be used to augment the security of the Lido Oracle.
contract SuccinctLidoOracleV1 is LidoZKOracle {
    /// @notice The address of the function gateway.
    address public immutable FUNCTION_GATEWAY;

    /// @notice The function id of the consensus oracle.
    bytes32 public immutable FUNCTION_ID;

    /// @notice The withdrawal credential of all Lido validators.
    bytes32 public immutable LIDO_WITHDRAWAL_CREDENTIAL;

    /// @notice The address of the requester.
    address public immutable REQUESTER;

    constructor(
        address _functionGateway,
        bytes32 _functionId,
        bytes32 _lidoWithdrawalCredential,
        address _requester
    ) {
        FUNCTION_GATEWAY = _functionGateway;
        FUNCTION_ID = _functionId;
        LIDO_WITHDRAWAL_CREDENTIAL = _lidoWithdrawalCredential;
        REQUESTER = _requester;
    }

    struct Report {
        bool requested;
        bool received;
        uint64 clBalanceGwei;
        uint32 numValidators;
        uint32 exitedValidators;
    }

    mapping(uint256 => Report) public reports;

    /// @dev The event emitted when a callback is received.
    event LidoOracleV1Update(
        uint64 slot, uint256 clBalancesGwei, uint256 numValidators, uint256 numExitedValidators
    );

    /// @notice The entrypoint for requesting an oracle update.
    function requestUpdate(bytes32 blockRoot, uint64 slot, uint32 callbackGasLimit)
        external
        payable
    {
        require(msg.sender == address(REQUESTER), "only requester can request proof");
        require(!reports[uint256(slot)].requested, "already requested");
        reports[uint256(slot)].requested = true;
        // TODO: Post EIP-4778, we will get block hash directly from on chain.
        ISuccinctGateway(FUNCTION_GATEWAY).requestCallback{value: msg.value}(
            FUNCTION_ID,
            abi.encodePacked(blockRoot, LIDO_WITHDRAWAL_CREDENTIAL),
            abi.encode(slot),
            this.handleUpdate.selector,
            callbackGasLimit
        );
    }

    /// @notice The callback function for the oracle.
    function handleUpdate(bytes memory output, bytes memory context) external {
        require(msg.sender == FUNCTION_GATEWAY && ISuccinctGateway(FUNCTION_GATEWAY).isCallback());
        (uint64 slot) = abi.decode(context, (uint64));
        (uint64 clBalancesGwei, uint32 numValidators, uint32 numExitedValidators) =
            _readData(output);

        emit LidoOracleV1Update(slot, clBalancesGwei, numValidators, numExitedValidators);
        reports[slot] = Report({
            requested: true,
            received: true,
            clBalanceGwei: clBalancesGwei,
            numValidators: numValidators,
            exitedValidators: numExitedValidators
        });
    }

    function getReport(uint256 slot)
        external
        view
        override
        returns (bool, uint256, uint256, uint256)
    {
        Report memory report = reports[slot];
        return
            (report.received, report.clBalanceGwei, report.numValidators, report.exitedValidators);
    }

    /// @dev A helper function to read a uint64, uint32, and uint32 from a bytes array.
    function _readData(bytes memory _output) internal pure returns (uint64, uint32, uint32) {
        uint64 value1;
        uint32 value2;
        uint32 value3;
        assembly {
            value1 := mload(add(_output, 0x08)) // read uint64
            value2 := mload(add(_output, 0x0C)) // read uint32
            value3 := mload(add(_output, 0x10)) // read uint32
        }
        return (value1, value2, value3);
    }
}
