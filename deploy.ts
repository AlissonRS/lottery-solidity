import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
const { abi, evm } = require('./compile.ts');

require('dotenv').config();

const mnemonic = process.env.DEPLOY_MNEMONIC;
const url = process.env.DEPLOY_ENDPOINT;

const provider = new HDWalletProvider(mnemonic, url);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: []
        })
        .send({ from: accounts[0], gas: 1000000 });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};

deploy();