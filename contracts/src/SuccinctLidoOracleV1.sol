// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./interfaces/ISuccinctGateway.sol";
import "./interfaces/LidoZKOracle.sol";

/// @title SuccinctLidoOracleV1
/// @notice A demo of how the Succinct SDK can be used to augment the security of the Lido Oracle.
contract SuccinctLidoOracleV1 is LidoZKOracle {
    /// @notice The address of the function gateway.
    address public constant FUNCTION_GATEWAY = 0x852a94F8309D445D27222eDb1E92A4E83DdDd2a8;

    /// @notice The function id of the consensus oracle.
    bytes32 public constant FUNCTION_ID =
        0xd1d8fa90aa718adcfc579e81592bd5ba57ffd196e8dce05a256d1e6cf89adea3;

    /// @notice The withdrawal credential of all Lido validators.
    bytes32 public constant LIDO_WITHDRAWAL_CREDENTIAL =
        0x010000000000000000000000b9d7934878b5fb9610b3fe8a5e441e8fad7e293f;

    struct Report {
        bool exists;
        uint256 clBalanceGwei;
        uint256 numValidators;
        uint256 exitedValidators;
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
        require(
            msg.sender == address(0xDEd0000E32f8F40414d3ab3a830f735a3553E18e),
            "only owner can request proof"
        );
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
        (uint64 clBalancesGweiU64, uint32 numValidatorsU32, uint32 numExitedValidatorsU32) =
            _readData(output);
        uint256 clBalancesGwei = uint256(clBalancesGweiU64);
        uint256 numValidators = uint256(numValidatorsU32);
        uint256 numExitedValidators = uint256(numExitedValidatorsU32);

        emit LidoOracleV1Update(slot, clBalancesGwei, numValidators, numExitedValidators);
        reports[uint256(slot)] = Report({
            exists: true,
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
        return (report.exists, report.clBalanceGwei, report.numValidators, report.exitedValidators);
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
