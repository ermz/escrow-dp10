const Escrow = artifacts.require("Escrow");

//chai setup
const chai = require('chai');
const expect = chai.expect;
const BN = web3.utils.BN;
const chaiBN = require('chai-BN')(BN);
chai.use(chaiBN);

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

contract("Escrow", async accounts => {
	let [lawyer, payer, recipient] = accounts;
	let escrow = null

	before(async () => {
		escrow = await Escrow.deployed();
	});

	it("should allow deposits to be made", async() => {
		await escrow.deposit({from: payer, value: 900});
		let escrowBalance = parseInt(await web3.eth.getBalance(escrow.address));
		return expect(escrowBalance).to.equal(900);
	});

	it("should allow me to add two number", async () => {
		return expect(1).to.equal(1);
	});


	// it("should NOT allow a deposit by anyone othen that the payer", async() => {
	// 	expect(await escrow.deposit({from: accounts[4], value: 50})).to.throw('Only payer is allowed to deposit');
	// });

	it("should NOT allow deposits from anyone other that the payer", async () => {
		return expect(escrow.deposit({from: lawyer, value: 50})).to.be.rejected;
	});

	it("should NOT allow to deposit if it will go over the amount limit", async () => {
		//Limit was 1000
		return expect(escrow.deposit({from: payer, value: 1001})).to.be.rejected;
	});

	it("should NOT release before the proper amount is ", async () => {
		await escrow.deposit({from: payer, value: 99});
		//makes sure that you need 100 to actually use release function
		await expect(escrow.release({from: lawyer})).to.be.rejected;
		await escrow.deposit({from: payer, value: 1});
		//makes sure that only lawyer is able to use release function
		await expect(escrow.release({from: recipient})).to.be.rejected;
		//Makes sure that release works when all requirements are met
		return expect(escrow.release({from: lawyer})).to.not.be.rejected;
	})

});
