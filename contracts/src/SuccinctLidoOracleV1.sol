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
    event LidoOracleV1Request(uint64 refSlot, uint64 availableSlot, bytes32 availableBlockRoot);

    /// @dev The event emitted when a callback is received.
    event LidoOracleV1Update(
        uint64 refSlot, uint256 clBalancesGwei, uint256 numValidators, uint256 numExitedValidators
    );

    /// @notice The address of the beacon roots precompile.
    /// @dev https://eips.ethereum.org/EIPS/eip-4788
    address internal constant BEACON_ROOTS = 0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02;

    /// @notice The maximum number of slots to search through.
    /// @dev This is 1 day worth of slots.
    uint256 internal constant MAX_SLOT_ATTEMPTS = 7200;

    /// @notice The address of the Succinct gateway.
    address public immutable SUCCINCT_GATEWAY;

    /// @notice The function id of the consensus oracle.
    bytes32 public immutable FUNCTION_ID;

    /// @notice The withdrawal credential of all Lido validators.
    bytes32 public immutable LIDO_WITHDRAWAL_CREDENTIAL;

    /// @notice The mapping of requesters. Address -> IsRequester.
    mapping(address => bool) public REQUESTERS;

    /// @notice The genesis block timestamp.
    uint256 public immutable GENESIS_BLOCK_TIMESTAMP;

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
    /// @param refSlot The reference slot to request an update for.
    /// @param callbackGasLimit The gas limit for the callback into handleUpdate.
    function requestUpdate(uint64 refSlot, uint32 callbackGasLimit) external payable {
        require(REQUESTERS[msg.sender], "only requester can request proof");
        require(!reports[uint256(refSlot)].requested, "already requested");

        (uint64 availableSlot, bytes32 availableBlockRoot) = findAvailableSlot(refSlot);

        reports[uint256(refSlot)].requested = true;

        ISuccinctGateway(SUCCINCT_GATEWAY).requestCallback{value: msg.value}(
            FUNCTION_ID,
            abi.encodePacked(availableBlockRoot, LIDO_WITHDRAWAL_CREDENTIAL),
            abi.encode(refSlot),
            this.handleUpdate.selector,
            callbackGasLimit
        );

        emit LidoOracleV1Request(refSlot, availableSlot, availableBlockRoot);
    }

    /// @notice Attempts to find the first available slot and its beacon root before or at the given slot.
    /// @param refSlot The slot to start searching from.
    /// @return availableSlot The first available slot found.
    /// @return availablRoot The beacon root of the first available slot found.
    /// @dev BEACON_ROOTS returns a block root for a given parent block's timestamp, e.g. to get the block root for slot
    ///      1000, you use the timestamp of slot 1001.
    function findAvailableSlot(uint64 refSlot)
        public
        view
        returns (uint64 availableSlot, bytes32 availablRoot)
    {
        uint64 currSlot = refSlot + 1;
        bool success;
        bytes memory result;

        for (uint64 i = 0; i < MAX_SLOT_ATTEMPTS; i++) {
            if (currSlot == 0) {
                break;
            }

            uint256 currTimestamp = GENESIS_BLOCK_TIMESTAMP + (currSlot * 12);
            (success, result) = BEACON_ROOTS.staticcall(abi.encode(currTimestamp));
            if (success && result.length > 0) {
                return (currSlot - 1, abi.decode(result, (bytes32)));
            }

            currSlot--;
        }

        revert("No available slot found");
    }

    /// @notice The callback function for the oracle.
    function handleUpdate(bytes calldata output, bytes calldata context) external {
        require(msg.sender == SUCCINCT_GATEWAY && ISuccinctGateway(SUCCINCT_GATEWAY).isCallback());
        (uint64 refSlot) = abi.decode(context, (uint64));
        (uint64 clBalancesGwei, uint32 numValidators, uint32 numExitedValidators) =
            _readData(output);

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
