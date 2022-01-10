const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'src', 'contracts', 'Lottery.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['evm.bytecode', 'abi']
            }
        }
    }
};

const compiled = solc.compile(JSON.stringify(input));
const obj = JSON.parse(compiled);


module.exports = obj.contracts['Lottery.sol']['Lottery'];