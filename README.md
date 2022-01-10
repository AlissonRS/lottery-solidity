# Solidity Lottery

A Solidity app that simulates a lottery (for learning purposes). It contains tests written in Typescript, using Mocha.

It specifies a contract that allows players joining by paying at least .01 ether. The manager (who deployed the contract) can pick the winner using a pseudo-random code (the code is deterministic).

Before starting, make sure you install all npm dependencies by running:

    yarn

To run the tests:

    yarn test

To deploy the contract, create a `.env` file in the root folder (same where the `package.json` is located), and add the mnemonic and network deployment as below:

DEPLOY_MNEMONIC=invalid mnemonic dont try using this one because it wont work anyway
DEPLOY_ENDPOINT=https://rinkeby.infura.io/v3/123a123a123a123a123a123a123a132

> DON'T USE YOUR PERSONAL WALLET'S MNEMONIC. CREATE A NEW ONE FOR DEVELOPMENT!!!!

The mnemonic can be created via [MetaMask](https://metamask.io) (just create a brand new account, you'll get the mnemonic during the sign up process).

The URL you can get from [Infura](https://infura.io). Create your account, and setup a test project to retrieve your deployment url. I recommend using the Rinkeby network (not Mainnet).
Happy coding :)

With the `.env` file in place (make sure not to commit it to any git repos), you can deploy with this command:

    yarn deploy

Happy Coding :D