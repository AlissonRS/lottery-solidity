// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        bytes memory encoded = abi.encodePacked(
            block.difficulty,
            block.timestamp,
            players
        );
        return uint256(keccak256(encoded));
    }

    function pickWinner() public restricted {
        uint256 index = random() % players.length;
        address payable winner = payable(players[index]); // convert to payable
        winner.transfer(address(this).balance);
        players = new address[](0);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    modifier restricted() {
        require(msg.sender == manager); // only the manager can pick the winner
        _;
    }
}
