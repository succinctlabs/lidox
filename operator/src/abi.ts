export const SUCCINCT_LIDO_ORACLE_V1_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'slot',
                type: 'uint64'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'clBalancesGwei',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'numValidators',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'numExitedValidators',
                type: 'uint256'
            }
        ],
        name: 'LidoOracleV1Update',
        type: 'event'
    },
    {
        inputs: [],
        name: 'FUNCTION_GATEWAY',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'FUNCTION_ID',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'LIDO_WITHDRAWAL_CREDENTIAL',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'slot',
                type: 'uint256'
            }
        ],
        name: 'getReport',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'output',
                type: 'bytes'
            },
            {
                internalType: 'bytes',
                name: 'context',
                type: 'bytes'
            }
        ],
        name: 'handleUpdate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        name: 'reports',
        outputs: [
            {
                internalType: 'bool',
                name: 'requested',
                type: 'bool'
            },
            {
                internalType: 'bool',
                name: 'received',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'clBalanceGwei',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'numValidators',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'exitedValidators',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'blockRoot',
                type: 'bytes32'
            },
            {
                internalType: 'uint64',
                name: 'slot',
                type: 'uint64'
            },
            {
                internalType: 'uint32',
                name: 'callbackGasLimit',
                type: 'uint32'
            }
        ],
        name: 'requestUpdate',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    }
] as const;

export const LIDO_LOCATOR_ABI = [
    {
        inputs: [
            {
                components: [
                    { internalType: 'address', name: 'accountingOracle', type: 'address' },
                    { internalType: 'address', name: 'depositSecurityModule', type: 'address' },
                    { internalType: 'address', name: 'elRewardsVault', type: 'address' },
                    { internalType: 'address', name: 'legacyOracle', type: 'address' },
                    { internalType: 'address', name: 'lido', type: 'address' },
                    { internalType: 'address', name: 'oracleReportSanityChecker', type: 'address' },
                    { internalType: 'address', name: 'postTokenRebaseReceiver', type: 'address' },
                    { internalType: 'address', name: 'burner', type: 'address' },
                    { internalType: 'address', name: 'stakingRouter', type: 'address' },
                    { internalType: 'address', name: 'treasury', type: 'address' },
                    { internalType: 'address', name: 'validatorsExitBusOracle', type: 'address' },
                    { internalType: 'address', name: 'withdrawalQueue', type: 'address' },
                    { internalType: 'address', name: 'withdrawalVault', type: 'address' },
                    { internalType: 'address', name: 'oracleDaemonConfig', type: 'address' }
                ],
                internalType: 'struct LidoLocator.Config',
                name: '_config',
                type: 'tuple'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    { inputs: [], name: 'ZeroAddress', type: 'error' },
    {
        inputs: [],
        name: 'accountingOracle',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'burner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'coreComponents',
        outputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'depositSecurityModule',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'elRewardsVault',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'legacyOracle',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'lido',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'oracleDaemonConfig',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'oracleReportComponentsForLido',
        outputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'oracleReportSanityChecker',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'postTokenRebaseReceiver',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'stakingRouter',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'treasury',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'validatorsExitBusOracle',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'withdrawalQueue',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'withdrawalVault',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

export const LIDO_ACCOUNTING_ORACLE_ABI = [
    {
        inputs: [
            { internalType: 'address', name: 'lidoLocator', type: 'address' },
            { internalType: 'address', name: 'lido', type: 'address' },
            { internalType: 'address', name: 'legacyOracle', type: 'address' },
            { internalType: 'uint256', name: 'secondsPerSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'genesisTime', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    { inputs: [], name: 'AddressCannotBeSame', type: 'error' },
    { inputs: [], name: 'AddressCannotBeZero', type: 'error' },
    { inputs: [], name: 'AdminCannotBeZero', type: 'error' },
    { inputs: [], name: 'CannotSubmitExtraDataBeforeMainData', type: 'error' },
    { inputs: [], name: 'ExtraDataAlreadyProcessed', type: 'error' },
    { inputs: [], name: 'ExtraDataHashCannotBeZeroForNonEmptyData', type: 'error' },
    { inputs: [], name: 'ExtraDataItemsCountCannotBeZeroForNonEmptyData', type: 'error' },
    { inputs: [], name: 'ExtraDataListOnlySupportsSingleTx', type: 'error' },
    { inputs: [], name: 'HashCannotBeZero', type: 'error' },
    {
        inputs: [{ internalType: 'uint256', name: 'code', type: 'uint256' }],
        name: 'IncorrectOracleMigration',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'initialRefSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'processingRefSlot', type: 'uint256' }
        ],
        name: 'InitialRefSlotCannotBeLessThanProcessingOne',
        type: 'error'
    },
    { inputs: [], name: 'InvalidContractVersionIncrement', type: 'error' },
    { inputs: [], name: 'InvalidExitedValidatorsData', type: 'error' },
    {
        inputs: [{ internalType: 'uint256', name: 'itemIndex', type: 'uint256' }],
        name: 'InvalidExtraDataItem',
        type: 'error'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'itemIndex', type: 'uint256' }],
        name: 'InvalidExtraDataSortOrder',
        type: 'error'
    },
    { inputs: [], name: 'LegacyOracleCannotBeZero', type: 'error' },
    { inputs: [], name: 'LidoCannotBeZero', type: 'error' },
    { inputs: [], name: 'LidoLocatorCannotBeZero', type: 'error' },
    { inputs: [], name: 'NoConsensusReportToProcess', type: 'error' },
    { inputs: [], name: 'NonZeroContractVersionOnInit', type: 'error' },
    {
        inputs: [{ internalType: 'uint256', name: 'deadline', type: 'uint256' }],
        name: 'ProcessingDeadlineMissed',
        type: 'error'
    },
    { inputs: [], name: 'RefSlotAlreadyProcessing', type: 'error' },
    {
        inputs: [
            { internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'prevRefSlot', type: 'uint256' }
        ],
        name: 'RefSlotCannotDecrease',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'processingRefSlot', type: 'uint256' }
        ],
        name: 'RefSlotMustBeGreaterThanProcessingOne',
        type: 'error'
    },
    { inputs: [], name: 'SecondsPerSlotCannotBeZero', type: 'error' },
    { inputs: [], name: 'SenderIsNotTheConsensusContract', type: 'error' },
    { inputs: [], name: 'SenderNotAllowed', type: 'error' },
    { inputs: [], name: 'UnexpectedChainConfig', type: 'error' },
    {
        inputs: [
            { internalType: 'uint256', name: 'expectedVersion', type: 'uint256' },
            { internalType: 'uint256', name: 'receivedVersion', type: 'uint256' }
        ],
        name: 'UnexpectedConsensusVersion',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'expected', type: 'uint256' },
            { internalType: 'uint256', name: 'received', type: 'uint256' }
        ],
        name: 'UnexpectedContractVersion',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'consensusHash', type: 'bytes32' },
            { internalType: 'bytes32', name: 'receivedHash', type: 'bytes32' }
        ],
        name: 'UnexpectedDataHash',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'expectedFormat', type: 'uint256' },
            { internalType: 'uint256', name: 'receivedFormat', type: 'uint256' }
        ],
        name: 'UnexpectedExtraDataFormat',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'consensusHash', type: 'bytes32' },
            { internalType: 'bytes32', name: 'receivedHash', type: 'bytes32' }
        ],
        name: 'UnexpectedExtraDataHash',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'expectedIndex', type: 'uint256' },
            { internalType: 'uint256', name: 'receivedIndex', type: 'uint256' }
        ],
        name: 'UnexpectedExtraDataIndex',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'expectedCount', type: 'uint256' },
            { internalType: 'uint256', name: 'receivedCount', type: 'uint256' }
        ],
        name: 'UnexpectedExtraDataItemsCount',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'consensusRefSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'dataRefSlot', type: 'uint256' }
        ],
        name: 'UnexpectedRefSlot',
        type: 'error'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'format', type: 'uint256' }],
        name: 'UnsupportedExtraDataFormat',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'itemIndex', type: 'uint256' },
            { internalType: 'uint256', name: 'dataType', type: 'uint256' }
        ],
        name: 'UnsupportedExtraDataType',
        type: 'error'
    },
    { inputs: [], name: 'VersionCannotBeSame', type: 'error' },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
            { indexed: true, internalType: 'address', name: 'prevAddr', type: 'address' }
        ],
        name: 'ConsensusHashContractSet',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'version', type: 'uint256' },
            { indexed: true, internalType: 'uint256', name: 'prevVersion', type: 'uint256' }
        ],
        name: 'ConsensusVersionSet',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'uint256', name: 'version', type: 'uint256' }],
        name: 'ContractVersionSet',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'itemsProcessed', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'itemsCount', type: 'uint256' }
        ],
        name: 'ExtraDataSubmitted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { indexed: false, internalType: 'bytes32', name: 'hash', type: 'bytes32' }
        ],
        name: 'ProcessingStarted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { indexed: false, internalType: 'bytes32', name: 'hash', type: 'bytes32' }
        ],
        name: 'ReportDiscarded',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { indexed: false, internalType: 'bytes32', name: 'hash', type: 'bytes32' },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'processingDeadlineTime',
                type: 'uint256'
            }
        ],
        name: 'ReportSubmitted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { indexed: true, internalType: 'bytes32', name: 'previousAdminRole', type: 'bytes32' },
            { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' }
        ],
        name: 'RoleAdminChanged',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: 'account', type: 'address' },
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
        ],
        name: 'RoleGranted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: 'account', type: 'address' },
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
        ],
        name: 'RoleRevoked',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'processedItemsCount',
                type: 'uint256'
            },
            { indexed: false, internalType: 'uint256', name: 'itemsCount', type: 'uint256' }
        ],
        name: 'WarnExtraDataIncompleteProcessing',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' }],
        name: 'WarnProcessingMissed',
        type: 'event'
    },
    {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'EXTRA_DATA_FORMAT_EMPTY',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'EXTRA_DATA_FORMAT_LIST',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'EXTRA_DATA_TYPE_EXITED_VALIDATORS',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'EXTRA_DATA_TYPE_STUCK_VALIDATORS',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'GENESIS_TIME',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'LEGACY_ORACLE',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'LIDO',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'LOCATOR',
        outputs: [{ internalType: 'contract ILidoLocator', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MANAGE_CONSENSUS_CONTRACT_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MANAGE_CONSENSUS_VERSION_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'SECONDS_PER_SLOT',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'SUBMIT_DATA_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'refSlot', type: 'uint256' }],
        name: 'discardConsensusReport',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getConsensusContract',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getConsensusReport',
        outputs: [
            { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
            { internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'processingDeadlineTime', type: 'uint256' },
            { internalType: 'bool', name: 'processingStarted', type: 'bool' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getConsensusVersion',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getContractVersion',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getLastProcessingRefSlot',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getProcessingState',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'currentFrameRefSlot', type: 'uint256' },
                    { internalType: 'uint256', name: 'processingDeadlineTime', type: 'uint256' },
                    { internalType: 'bytes32', name: 'mainDataHash', type: 'bytes32' },
                    { internalType: 'bool', name: 'mainDataSubmitted', type: 'bool' },
                    { internalType: 'bytes32', name: 'extraDataHash', type: 'bytes32' },
                    { internalType: 'uint256', name: 'extraDataFormat', type: 'uint256' },
                    { internalType: 'bool', name: 'extraDataSubmitted', type: 'bool' },
                    { internalType: 'uint256', name: 'extraDataItemsCount', type: 'uint256' },
                    { internalType: 'uint256', name: 'extraDataItemsSubmitted', type: 'uint256' }
                ],
                internalType: 'struct AccountingOracle.ProcessingState',
                name: 'result',
                type: 'tuple'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
        name: 'getRoleAdmin',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'uint256', name: 'index', type: 'uint256' }
        ],
        name: 'getRoleMember',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
        name: 'getRoleMemberCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'hasRole',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'admin', type: 'address' },
            { internalType: 'address', name: 'consensusContract', type: 'address' },
            { internalType: 'uint256', name: 'consensusVersion', type: 'uint256' }
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'admin', type: 'address' },
            { internalType: 'address', name: 'consensusContract', type: 'address' },
            { internalType: 'uint256', name: 'consensusVersion', type: 'uint256' },
            { internalType: 'uint256', name: 'lastProcessingRefSlot', type: 'uint256' }
        ],
        name: 'initializeWithoutMigration',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        name: 'setConsensusContract',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'version', type: 'uint256' }],
        name: 'setConsensusVersion',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'reportHash', type: 'bytes32' },
            { internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'submitConsensusReport',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'consensusVersion', type: 'uint256' },
                    { internalType: 'uint256', name: 'refSlot', type: 'uint256' },
                    { internalType: 'uint256', name: 'numValidators', type: 'uint256' },
                    { internalType: 'uint256', name: 'clBalanceGwei', type: 'uint256' },
                    {
                        internalType: 'uint256[]',
                        name: 'stakingModuleIdsWithNewlyExitedValidators',
                        type: 'uint256[]'
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'numExitedValidatorsByStakingModule',
                        type: 'uint256[]'
                    },
                    { internalType: 'uint256', name: 'withdrawalVaultBalance', type: 'uint256' },
                    { internalType: 'uint256', name: 'elRewardsVaultBalance', type: 'uint256' },
                    { internalType: 'uint256', name: 'sharesRequestedToBurn', type: 'uint256' },
                    {
                        internalType: 'uint256[]',
                        name: 'withdrawalFinalizationBatches',
                        type: 'uint256[]'
                    },
                    { internalType: 'uint256', name: 'simulatedShareRate', type: 'uint256' },
                    { internalType: 'bool', name: 'isBunkerMode', type: 'bool' },
                    { internalType: 'uint256', name: 'extraDataFormat', type: 'uint256' },
                    { internalType: 'bytes32', name: 'extraDataHash', type: 'bytes32' },
                    { internalType: 'uint256', name: 'extraDataItemsCount', type: 'uint256' }
                ],
                internalType: 'struct AccountingOracle.ReportData',
                name: 'data',
                type: 'tuple'
            },
            { internalType: 'uint256', name: 'contractVersion', type: 'uint256' }
        ],
        name: 'submitReportData',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'submitReportExtraDataEmpty',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes', name: 'items', type: 'bytes' }],
        name: 'submitReportExtraDataList',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

export const LIDO_HASH_CONSENSUS_ABI = [
    {
        inputs: [
            { internalType: 'uint256', name: 'slotsPerEpoch', type: 'uint256' },
            { internalType: 'uint256', name: 'secondsPerSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'genesisTime', type: 'uint256' },
            { internalType: 'uint256', name: 'epochsPerFrame', type: 'uint256' },
            { internalType: 'uint256', name: 'fastLaneLengthSlots', type: 'uint256' },
            { internalType: 'address', name: 'admin', type: 'address' },
            { internalType: 'address', name: 'reportProcessor', type: 'address' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    { inputs: [], name: 'AddressCannotBeZero', type: 'error' },
    { inputs: [], name: 'AdminCannotBeZero', type: 'error' },
    { inputs: [], name: 'ConsensusReportAlreadyProcessing', type: 'error' },
    { inputs: [], name: 'DuplicateMember', type: 'error' },
    { inputs: [], name: 'DuplicateReport', type: 'error' },
    { inputs: [], name: 'EmptyReport', type: 'error' },
    { inputs: [], name: 'EpochsPerFrameCannotBeZero', type: 'error' },
    { inputs: [], name: 'FastLanePeriodCannotBeLongerThanFrame', type: 'error' },
    { inputs: [], name: 'InitialEpochAlreadyArrived', type: 'error' },
    { inputs: [], name: 'InitialEpochIsYetToArrive', type: 'error' },
    { inputs: [], name: 'InitialEpochRefSlotCannotBeEarlierThanProcessingSlot', type: 'error' },
    { inputs: [], name: 'InvalidChainConfig', type: 'error' },
    { inputs: [], name: 'InvalidSlot', type: 'error' },
    { inputs: [], name: 'NewProcessorCannotBeTheSame', type: 'error' },
    { inputs: [], name: 'NonFastLaneMemberCannotReportWithinFastLaneInterval', type: 'error' },
    { inputs: [], name: 'NonMember', type: 'error' },
    { inputs: [], name: 'NumericOverflow', type: 'error' },
    {
        inputs: [
            { internalType: 'uint256', name: 'minQuorum', type: 'uint256' },
            { internalType: 'uint256', name: 'receivedQuorum', type: 'uint256' }
        ],
        name: 'QuorumTooSmall',
        type: 'error'
    },
    { inputs: [], name: 'ReportProcessorCannotBeZero', type: 'error' },
    { inputs: [], name: 'StaleReport', type: 'error' },
    {
        inputs: [
            { internalType: 'uint256', name: 'expected', type: 'uint256' },
            { internalType: 'uint256', name: 'received', type: 'uint256' }
        ],
        name: 'UnexpectedConsensusVersion',
        type: 'error'
    },
    {
        anonymous: false,
        inputs: [{ indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' }],
        name: 'ConsensusLost',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { indexed: false, internalType: 'bytes32', name: 'report', type: 'bytes32' },
            { indexed: false, internalType: 'uint256', name: 'support', type: 'uint256' }
        ],
        name: 'ConsensusReached',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'fastLaneLengthSlots',
                type: 'uint256'
            }
        ],
        name: 'FastLaneConfigSet',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'newInitialEpoch', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newEpochsPerFrame', type: 'uint256' }
        ],
        name: 'FrameConfigSet',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'newTotalMembers', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newQuorum', type: 'uint256' }
        ],
        name: 'MemberAdded',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'newTotalMembers', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'newQuorum', type: 'uint256' }
        ],
        name: 'MemberRemoved',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'newQuorum', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'totalMembers', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: 'prevQuorum', type: 'uint256' }
        ],
        name: 'QuorumSet',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'processor', type: 'address' },
            { indexed: true, internalType: 'address', name: 'prevProcessor', type: 'address' }
        ],
        name: 'ReportProcessorSet',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'member', type: 'address' },
            { indexed: false, internalType: 'bytes32', name: 'report', type: 'bytes32' }
        ],
        name: 'ReportReceived',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { indexed: true, internalType: 'bytes32', name: 'previousAdminRole', type: 'bytes32' },
            { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' }
        ],
        name: 'RoleAdminChanged',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: 'account', type: 'address' },
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
        ],
        name: 'RoleGranted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: 'account', type: 'address' },
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' }
        ],
        name: 'RoleRevoked',
        type: 'event'
    },
    {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DISABLE_CONSENSUS_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MANAGE_FAST_LANE_CONFIG_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MANAGE_FRAME_CONFIG_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MANAGE_MEMBERS_AND_QUORUM_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MANAGE_REPORT_PROCESSOR_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'addr', type: 'address' },
            { internalType: 'uint256', name: 'quorum', type: 'uint256' }
        ],
        name: 'addMember',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'disableConsensus',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getChainConfig',
        outputs: [
            { internalType: 'uint256', name: 'slotsPerEpoch', type: 'uint256' },
            { internalType: 'uint256', name: 'secondsPerSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'genesisTime', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getConsensusState',
        outputs: [
            { internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { internalType: 'bytes32', name: 'consensusReport', type: 'bytes32' },
            { internalType: 'bool', name: 'isReportProcessing', type: 'bool' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        name: 'getConsensusStateForMember',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'currentFrameRefSlot', type: 'uint256' },
                    {
                        internalType: 'bytes32',
                        name: 'currentFrameConsensusReport',
                        type: 'bytes32'
                    },
                    { internalType: 'bool', name: 'isMember', type: 'bool' },
                    { internalType: 'bool', name: 'isFastLane', type: 'bool' },
                    { internalType: 'bool', name: 'canReport', type: 'bool' },
                    { internalType: 'uint256', name: 'lastMemberReportRefSlot', type: 'uint256' },
                    { internalType: 'bytes32', name: 'currentFrameMemberReport', type: 'bytes32' }
                ],
                internalType: 'struct HashConsensus.MemberConsensusState',
                name: 'result',
                type: 'tuple'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getCurrentFrame',
        outputs: [
            { internalType: 'uint256', name: 'refSlot', type: 'uint256' },
            { internalType: 'uint256', name: 'reportProcessingDeadlineSlot', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getFastLaneMembers',
        outputs: [
            { internalType: 'address[]', name: 'addresses', type: 'address[]' },
            { internalType: 'uint256[]', name: 'lastReportedRefSlots', type: 'uint256[]' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getFrameConfig',
        outputs: [
            { internalType: 'uint256', name: 'initialEpoch', type: 'uint256' },
            { internalType: 'uint256', name: 'epochsPerFrame', type: 'uint256' },
            { internalType: 'uint256', name: 'fastLaneLengthSlots', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getInitialRefSlot',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        name: 'getIsFastLaneMember',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        name: 'getIsMember',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getMembers',
        outputs: [
            { internalType: 'address[]', name: 'addresses', type: 'address[]' },
            { internalType: 'uint256[]', name: 'lastReportedRefSlots', type: 'uint256[]' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getQuorum',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getReportProcessor',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getReportVariants',
        outputs: [
            { internalType: 'bytes32[]', name: 'variants', type: 'bytes32[]' },
            { internalType: 'uint256[]', name: 'support', type: 'uint256[]' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
        name: 'getRoleAdmin',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'uint256', name: 'index', type: 'uint256' }
        ],
        name: 'getRoleMember',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
        name: 'getRoleMemberCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'hasRole',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'addr', type: 'address' },
            { internalType: 'uint256', name: 'quorum', type: 'uint256' }
        ],
        name: 'removeMember',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'bytes32', name: 'role', type: 'bytes32' },
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'fastLaneLengthSlots', type: 'uint256' }],
        name: 'setFastLaneLengthSlots',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'epochsPerFrame', type: 'uint256' },
            { internalType: 'uint256', name: 'fastLaneLengthSlots', type: 'uint256' }
        ],
        name: 'setFrameConfig',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'quorum', type: 'uint256' }],
        name: 'setQuorum',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'newProcessor', type: 'address' }],
        name: 'setReportProcessor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'slot', type: 'uint256' },
            { internalType: 'bytes32', name: 'report', type: 'bytes32' },
            { internalType: 'uint256', name: 'consensusVersion', type: 'uint256' }
        ],
        name: 'submitReport',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'initialEpoch', type: 'uint256' }],
        name: 'updateInitialEpoch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const;
