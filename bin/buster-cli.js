const yargs = require('yargs');
const main = require('../');
const exitOnError = require('../utils/exit-on-error');
const chalk = require('chalk');
const {DEFAULT_FUNCTION_CALL_GAS} = require('near-api-js');

// For account:

const login = {
    command: 'login',
    desc: 'logging in through Buster wallet',
    builder: (yargs) => yargs
        .option('walletUrl', {
            desc: 'URL of wallet to use',
            type: 'string',
            required: false
        }),
    handler: exitOnError(main.login)
};

const viewAccount = {
    command: 'state <accountId>',
    desc: 'view account state',
    builder: (yargs) => yargs
        .option('accountId', {
            desc: 'Account to view',
            type: 'string',
            required: true
        }),
    handler: exitOnError(main.viewAccount)
};

const deleteAccount = {
    command: 'delete <accountId> <beneficiaryId>',
    desc: 'delete an account and transfer Buster tokens to beneficiary account.',
    builder: (yargs) => yargs
        .option('accountId', {
            desc: 'Account to delete',
            type: 'string',
            required: true
        })
        .option('beneficiaryId', {
            desc: 'Account to transfer funds to',
            type: 'string',
            required: true
        }),
    handler: exitOnError(main.deleteAccount)
};

const keys = {
    command: 'keys <accountId>',
    desc: 'view account public keys',
    builder: (yargs) => yargs
        .option('accountId', {
            desc: 'Account to view',
            type: 'string',
            required: true
        }),
    handler: exitOnError(main.keys)
};

const sendMoney = {
    command: 'send <sender> <receiver> <amount>',
    desc: 'send tokens to given receiver',
    builder: (yargs) => yargs
        .option('amount', {
            desc: 'Amount of BOOM tokens to send',
            type: 'string',
        }),
    handler: exitOnError(main.sendMoney)
};

const b_sendMoney = {
    command: 'b_send <sender> <receiver> <amount>',
    desc: 'send tokens to given receiver + 환율 변경',
    builder: (yargs) => yargs
        .option('amount', {
            desc: 'Amount of BOOM tokens to send',
            type: 'string',
        })
        .option('currency', {
            desc: '화폐 선택',
            type: 'string',
            required: true,
        }),
    handler: exitOnError(main.b_sendMoney)
};

const stake = {
    command: 'stake [accountId] [stakingKey] [amount]',
    desc: 'create staking transaction',
    builder: (yargs) => yargs
        .option('accountId', {
            desc: 'Account to stake on',
            type: 'string',
            required: true,
        })
        .option('stakingKey', {
            desc: 'Public key to stake with (base58 encoded)',
            type: 'string',
            required: true,
        })
        .option('amount', {
            desc: 'Amount to stake',
            type: 'string',
            required: true,
        }),
    handler: exitOnError(main.stake)
};

// For contract:
const deploy = {
    command: 'deploy [accountId] [wasmFile] [initFunction] [initArgs] [initGas] [initDeposit]',
    // command: 'deploy',
    desc: 'deploy your smart contract',
    builder: (yargs) => yargs
        .option('wasmFile', {
            desc: 'Path to wasm file to deploy',
            type: 'string',
            default: './out/main.wasm'
        })
        .option('initFunction', {
            desc: 'Initialization method',
            type: 'string',
        })
        .option('initArgs', {
            desc: 'Initialization arguments',
        })
        .option('initGas', {
            desc: 'Gas for initialization call',
            type: 'number',
            default: DEFAULT_FUNCTION_CALL_GAS
        })
        .option('initDeposit', {
            desc: 'Deposit in Ⓝ to send for initialization call',
            type: 'string',
            default: '0'
        })
        .alias({
            'accountId': ['account_id', 'contractName', 'contract_name'],
        }),
    handler: exitOnError(main.deploy)
};

const callViewFunction = {
    command: 'view <contractName> <methodName> [args]',
    desc: 'make smart contract call which can view state',
    builder: (yargs) => yargs
        .option('args', {
            desc: 'Arguments to the view call, in JSON format (e.g. \'{"param_a": "value"}\')',
            type: 'string',
            default: null
        })
        .alias({
            'contractName': ['accountId'],
        }),
    handler: exitOnError(main.callViewFunction)
};

const clean = {
    command: 'clean',
    desc: 'clean the build environment',
    builder: (yargs) => yargs
        .option('outDir', {
            desc: 'build directory',
            type: 'string',
            default: './out'
        }),
    handler: exitOnError(main.clean)
};

let config = require('../get-config')();
yargs // eslint-disable-line
    .strict()
    .middleware(require('../utils/check-version'))
    .scriptName('buster')
    .option('nodeUrl', {
        desc: 'BOOM node URL',
        type: 'string',
        default: config.nodeUrl
    })
    .option('headers', {
        hidden: true,
        desc: 'headers for BOOM RPC server calls',
        type: 'string',
    })
    .option('networkId', {
        desc: 'BOOM network ID, allows using different keys based on network',
        type: 'string',
        default: config.networkId
    })
    .option('helperUrl', {
        desc: 'BOOM contract helper URL',
        type: 'string',
    })
    .option('keyPath', {
        desc: 'Path to master account key',
        type: 'string',
    })
    .option('accountId', {
        desc: 'Unique identifier for the account',
        type: 'string',
    })
    .option('useLedgerKey', {
        desc: 'Use Ledger for signing with given HD key path',
        type: 'string',
        default: '44\'/397\'/0\'/0\'/1\''
    })
    .options('seedPhrase', {
        desc: 'Seed phrase mnemonic',
        type: 'string',
        required: false
    })
    .options('seedPath', {
        desc: 'HD path derivation',
        type: 'string',
        default: 'm/44\'/397\'/0\'',
        required: false
    })
    .option('walletUrl', {
        desc: 'Website for Buster Wallet',
        type: 'string'
    })
    .option('contractName', {
        desc: 'Account name of contract',
        type: 'string'
    })
    .option('masterAccount', {
        desc: 'Master account used when creating new accounts',
        type: 'string'
    })
    .option('helperAccount', {
        desc: 'Expected top-level account for a network',
        type: 'string'
    })
    .option('explorerUrl', {
        hidden: true,
        desc: 'Base url for explorer',
        type: 'string',
    })
    .option('verbose', {
        desc: 'Prints out verbose output',
        type: 'boolean',
        alias: 'v',
        default: false
    })
    .option('force', {
        desc: 'Forcefully execute the desired action even if it is unsafe to do so',
        type: 'boolean',
        default: false,
        alias: 'f'
    })
    .middleware(require('../middleware/initial-balance'))
    .middleware(require('../middleware/print-options'))
    .middleware(require('../middleware/key-store'))
    .middleware(require('../middleware/ledger'))
    .middleware(require('../middleware/abi'))
    .middleware(require('../middleware/seed-phrase'))
    .middleware(require('../middleware/x-api-key'))
    .command(require('../commands/create-account').createAccountCommand)
    .command(require('../commands/create-account').createAccountCommandDeprecated)
    .command(viewAccount)
    .command(deleteAccount)
    .command(keys)
    .command(require('../commands/tx-status'))
    .command(deploy)
    .command(require('../commands/dev-deploy'))
    .command(require('../commands/call'))
    .command(callViewFunction)
    .command(require('../commands/view-state'))
    .command(sendMoney)
    .command(b_sendMoney)
    .command(clean)
    .command(stake)
    .command(login)
    .command(require('../commands/repl'))
    .command(require('../commands/generate-key'))
    .command(require('../commands/add-key'))
    .command(require('../commands/delete-key'))
    .command(require('../commands/validators'))
    .command(require('../commands/proposals'))
    .command(require('../commands/evm-call'))
    .command(require('../commands/evm-dev-init'))
    .command(require('../commands/evm-view'))
    .command(require('../commands/set-x-api-key'))
    .command(require('../commands/js'))
    .config(config)
    .alias({
        'accountId': ['account_id'],
        'nodeUrl': 'node_url',
        'networkId': ['network_id'],
        'wasmFile': 'wasm_file',
        'projectDir': 'project_dir',
        'outDir': 'out_dir',
    })
    .showHelpOnFail(true)
    .recommendCommands()
    .demandCommand(1, chalk`Pass {bold --help} to see all available commands and options.`)
    .usage(chalk`Usage: {bold $0 <command> [options]}`)
    .epilogue(chalk`Check out our epic whiteboard series: {bold http://buster.ai/wbs}`)
    .wrap(null)
    .argv;