// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

/// @title IFunctionGateway
/// @dev The function gateway automatically verifies the proof and calls the callback function.
interface IFunctionGateway {
    function request(
        bytes32 functionId,
        bytes memory inputs,
        bytes4 callbackSelector,
        bytes memory context
    ) external payable;
}

/// @title LidoOracleV1
/// @notice A demo of how the Succinct SDK can be used to augment the security of the Lido Oracle.
contract LidoOracleV1 {
    /// @notice The address of the function gateway.
    address public constant FUNCTION_GATEWAY = 0x852a94F8309D445D27222eDb1E92A4E83DdDd2a8;

    /// @notice The function id of the consensus oracle.
    bytes32 public constant FUNCTION_ID =
        0xd1d8fa90aa718adcfc579e81592bd5ba57ffd196e8dce05a256d1e6cf89adea3;

    /// @notice The withdrawal credential of all Lido validators.
    bytes32 public constant LIDO_WITHDRAWAL_CREDENTIAL =
        0x010000000000000000000000b9d7934878b5fb9610b3fe8a5e441e8fad7e293f;

    /// @notice The cumulative balance of all Lido validators on the consensus layer.
    uint256 public clBalancesGwei;

    /// @notice The number of validators on consensus layer that were ever deposited.
    uint256 public numValidators;

    /// @notice The number of exited validators on the consensus layer that were ever deposited.
    uint256 public numExitedValidators;

    /// @dev The event emitted when a callback is received.
    event LidoOracleV1Update(
        bytes32 blockRoot,
        uint256 clBalancesGwei,
        uint256 numValidators,
        uint256 numExitedValidators
    );

    /// @dev A helper function to read a uint64, uint32, and uint32 from a bytes array.
    function readData(bytes memory _output) internal pure returns (uint64, uint32, uint32) {
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

    /// @notice The entrypoint for requesting an oracle update.
    function requestUpdate(bytes32 blockRoot) external payable {
        require(
            msg.sender == address(0xDEd0000E32f8F40414d3ab3a830f735a3553E18e),
            "only owner can request proof"
        );
        IFunctionGateway(FUNCTION_GATEWAY).request{value: msg.value}(
            FUNCTION_ID,
            abi.encodePacked(blockRoot, LIDO_WITHDRAWAL_CREDENTIAL),
            this.handleUpdate.selector,
            abi.encode(blockRoot)
        );
    }

    /// @notice The callback function for the oracle.
    function handleUpdate(bytes memory output, bytes memory context) external {
        require(msg.sender == FUNCTION_GATEWAY);
        bytes32 blockRoot = abi.decode(context, (bytes32));
        (uint64 clBalancesGweiU64, uint32 numValidatorsU32, uint32 numExitedValidatorsU32) =
            readData(output);
        clBalancesGwei = uint256(clBalancesGweiU64);
        numValidators = uint256(numValidatorsU32);
        numExitedValidators = uint256(numExitedValidatorsU32);
        emit LidoOracleV1Update(blockRoot, clBalancesGwei, numValidators, numExitedValidators);
    }
}
