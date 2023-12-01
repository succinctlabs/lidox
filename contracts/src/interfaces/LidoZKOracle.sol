pragma solidity ^0.8.16;

interface LidoZKOracle {
    function getReport(uint256 slot)
        external
        view
        returns (
            bool success,
            uint256 clBalanceGwei,
            uint256 numValidators,
            uint256 exitedValidators
        );
}
