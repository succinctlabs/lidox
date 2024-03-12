// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "succinctx/interfaces/ISuccinctGateway.sol";
import "./interfaces/LidoZKOracle.sol";

/// @title SuccinctLidoOracleV1
/// @notice A demo of how the Succinct SDK can be used to augment the security of the Lido Oracle.
contract SuccinctLidoOracleV1 is LidoZKOracle {
    struct Report {
        bool requested;
        bool received;
        uint64 clBalanceGwei;
        uint32 numValidators;
        uint32 exitedValidators;
    }

    /// @dev The event emitted when a request is made.
    event LidoOracleV1Request(uint64 refSlot, bytes32 availableBlockRoot);

    /// @dev The event emitted when a callback is received.
    event LidoOracleV1Update(
        uint64 refSlot, uint256 clBalancesGwei, uint256 numValidators, uint256 numExitedValidators
    );

    /// @notice The address of the beacon roots precompile.
    /// @dev https://eips.ethereum.org/EIPS/eip-4788
    address internal constant BEACON_ROOTS = 0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02;

    /// @notice The address of the Succinct gateway.
    address public immutable SUCCINCT_GATEWAY;

    /// @notice The function id of the consensus oracle.
    bytes32 public immutable FUNCTION_ID;

    /// @notice The withdrawal credential of all Lido validators.
    bytes32 public immutable LIDO_WITHDRAWAL_CREDENTIAL;

    /// @notice The genesis block timestamp.
    uint256 public immutable GENESIS_BLOCK_TIMESTAMP;

    /// @notice The mapping of requesters. Address -> IsRequester.
    mapping(address => bool) public REQUESTERS;

    /// @notice The mapping of reports. Slot -> Report.
    mapping(uint256 => Report) public reports;

    constructor(
        address _succinctGateway,
        bytes32 _functionId,
        bytes32 _lidoWithdrawalCredential,
        uint256 _genesisBlockTimestamp,
        address[] memory _requesters
    ) {
        SUCCINCT_GATEWAY = _succinctGateway;
        FUNCTION_ID = _functionId;
        LIDO_WITHDRAWAL_CREDENTIAL = _lidoWithdrawalCredential;
        GENESIS_BLOCK_TIMESTAMP = _genesisBlockTimestamp;

        for (uint256 i = 0; i < _requesters.length; i++) {
            REQUESTERS[_requesters[i]] = true;
        }
    }

    /// @notice The entrypoint for requesting an oracle update.
    /// @param _refSlot The reference slot to request an update for.
    /// @param _callbackGasLimit The gas limit for the callback into handleUpdate.
    function requestUpdate(uint64 _refSlot, uint32 _callbackGasLimit) external payable {
        require(REQUESTERS[msg.sender], "only requester can request proof");
        require(!reports[uint256(_refSlot)].requested, "already requested");

        bytes32 blockRoot = findBlockRoot(_refSlot);

        reports[uint256(_refSlot)].requested = true;

        ISuccinctGateway(SUCCINCT_GATEWAY).requestCallback{value: msg.value}(
            FUNCTION_ID,
            abi.encodePacked(blockRoot, LIDO_WITHDRAWAL_CREDENTIAL),
            abi.encode(_refSlot),
            this.handleUpdate.selector,
            _callbackGasLimit
        );

        emit LidoOracleV1Request(_refSlot, blockRoot);
    }

    /// @notice Attempts to find the block root for the given slot.
    /// @param _slot The slot to get the block root for.
    /// @return blockRoot The beacon block root of the given slot.
    /// @dev BEACON_ROOTS returns a block root for a given parent block's timestamp. To get the block root for slot
    ///      N, you use the timestamp of slot N+1. If N+1 is not avaliable, you use the timestamp of slot N+2, and
    //       so on.
    function findBlockRoot(uint64 _slot) public view returns (bytes32 blockRoot) {
        uint256 currBlockTimestamp = GENESIS_BLOCK_TIMESTAMP + ((_slot + 1) * 12);

        while (currBlockTimestamp <= block.timestamp) {
            (bool success, bytes memory result) =
                BEACON_ROOTS.staticcall(abi.encode(currBlockTimestamp));
            if (success && result.length > 0) {
                return abi.decode(result, (bytes32));
            }

            unchecked {
                currBlockTimestamp += 12;
            }
        }

        revert("No available slot found");
    }

    /// @notice The callback function for the oracle.
    function handleUpdate(bytes calldata _output, bytes calldata _context) external {
        require(msg.sender == SUCCINCT_GATEWAY && ISuccinctGateway(SUCCINCT_GATEWAY).isCallback());
        (uint64 refSlot) = abi.decode(_context, (uint64));
        (uint64 clBalancesGwei, uint32 numValidators, uint32 numExitedValidators) =
            _readData(_output);

        emit LidoOracleV1Update(refSlot, clBalancesGwei, numValidators, numExitedValidators);

        reports[refSlot] = Report({
            requested: true,
            received: true,
            clBalanceGwei: clBalancesGwei,
            numValidators: numValidators,
            exitedValidators: numExitedValidators
        });
    }

    function getReport(uint256 refSlot)
        external
        view
        override
        returns (bool, uint256, uint256, uint256)
    {
        Report memory report = reports[refSlot];
        return
            (report.received, report.clBalanceGwei, report.numValidators, report.exitedValidators);
    }

    /// @dev A helper function to read a uint64, uint32, and uint32 from a bytes array.
    function _readData(bytes calldata _output) internal pure returns (uint64, uint32, uint32) {
        require(_output.length >= 14, "invalid output data");
        uint64 value1 = uint64(bytes8(_output[:8]));
        uint32 value2 = uint32(bytes4(_output[8:12]));
        uint32 value3 = uint32(bytes4(_output[12:16]));
        return (value1, value2, value3);
    }
}
