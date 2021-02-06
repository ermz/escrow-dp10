const Escrow = artifacts.require("Escrow");
const expect = require('chai').expect;

const assertError = async (promise, e) => {
	try {
		await promise;
	} catch(e) {
		assert(e.message.includes(error));
		return;
	}
	assert(false);
}

contract("Escrow", async accounts => {
	const [lawyer, payer, recipient] = accounts;
	let escrow = null;

	before(async () => {
		escrow = await Escrow.deployed();
	});

	it("should allow you to deposit", async () => {
		// let escrow = await Escrow.deployed();
		await escrow.deposit({from: payer, value: 900});
		const escrowBalance = parseInt(await web3.eth.getBalance(escrow.address));
		assert.equal(escrowBalance, 900);
	});

	it("should NOT deposit if it exceeds amount necessary", () => {
		assertError(
			escrow.deposit({from: payer, value: 101}),
			"Will overflow amount limit"
		);
	});

	// it("should not deposit if not sending from payer", async () => {
	// 	assertError(
	// 		escrow.deposit({from: accounts[6]}),
	// 		"Only payer is allowed to deposit"
	// 	);
	// });

	it("Should allow release if lawyer and exceeds amount", async () => {
		await escrow.deposit({from: payer, value: 100});
		let newBalance = parseInt(await web3.getBalance(escrow.address));
		assert(newBalance == 0);
	})	 

});
