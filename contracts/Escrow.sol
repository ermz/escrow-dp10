pragma solidity ^0.7.5;

contract Escrow {
	address public payer;
	address payable public payee;
	address public lawyer;
	uint public amount;

	constructor(address _payer, address payable _payee, uint _amount) {
		lawyer = msg.sender;
		payer = _payer;
		payee = _payee;
		amount = _amount;
	} 

	function deposit() payable public {
		require(msg.sender == payer, "Must be the payer");
		//This second require checks if the balance of this address exceeds the amount state above
		//This way it won't be possible to use deposit twice and send more money than is required
		require(address(this).balance <= amount, "Sould not deposit if it exceeds amount");
	}

	function release() public {
		require(address(this).balance == amount, "Must have right amount before it's sent");
		require(msg.sender == lawyer, "Only lawyer is allowed to release funds");
		payee.transfer(amount);
	}

	function balanceOf() view public returns (uint) {
		return address(this).balance;
	}
}