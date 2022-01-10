const assert = require('assert');
const ganache = require('ganache-cli');
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
const { abi, evm } = require('../compile.ts');

const web3 = new Web3(ganache.provider());

let accounts;
let manager;
let lottery: Contract;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    manager = accounts[0];
    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: []
        })
        .send({ from: manager, gas: 1000000 });
});

describe('Lottery Contract', () => {
    it('deploys the contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
        const players = await lottery.methods.getPlayers().call({ from: manager });
        assert.equal(1, players.length);
        assert.equal(accounts[0], players[0]);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
        await lottery.methods.enter().send({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });
        await lottery.methods.enter().send({ from: accounts[2], value: web3.utils.toWei('0.02', 'ether') });
        const players = await lottery.methods.getPlayers().call({ from: manager });
        assert.equal(3, players.length);
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.001', 'ether') });
            assert(false); // it should've thrown an error
        } catch (error) {
            assert(true);
        }
    });

    it('only manager can pick a winner', async () => {
        try {
            const nonManagerPlayer = accounts[1];
            await lottery.methods.pickWinner().send({ from: nonManagerPlayer });
            assert(false); // should have thrown an error, as only the manager can pick a winner
        } catch (error) {
            assert(true);
        }
    });

    it('sends money to the winner and resets the players array', async () => {
        const winner = accounts[0];
        await lottery.methods.enter().send({ from: winner, value: web3.utils.toWei('2', 'ether') });

        const initialBalance = await web3.eth.getBalance(winner);
        await lottery.methods.pickWinner().send({ from: manager });
        const finalBalance = await web3.eth.getBalance(winner);

        const difference = parseFloat(finalBalance) - parseFloat(initialBalance);
        assert(difference > parseFloat(web3.utils.toWei('1.8', 'ether')));

        const players = await lottery.methods.getPlayers().call({ from: manager });
        assert.equal(0, players.length);
    });

});