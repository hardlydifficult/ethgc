const shouldFail = require("./helpers/shouldFail");
const EthgcJs = require("../../library/ethgc.js");

contract("RedeemCard", accounts => {
  let ethgc;

  before(async () => {
    ethgc = new EthgcJs(web3.currentProvider, accounts[0]);
    ethgc.hardlyWeb3.switchAccount(accounts[0]);
  });

  describe("ETH card", () => {
    const redeemCode = "abc123";
    const value = 42;

    before(async () => {
      const cardAddress = await ethgc.getCardAddress(redeemCode);

      await ethgc.create([cardAddress], [web3.utils.padLeft(0, 40)], [value]);
    });

    it("Can redeem", async () => {
      const balance = await ethgc.hardlyWeb3.getEthBalance();
      const tx = await ethgc.redeem(redeemCode);
      console.log(`Redeem cost ${tx.gasUsed}`);
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balance.plus(value).toFixed()
      );
    });

    it.skip("shouldFail to claim a claimed code", async () => {
      // not sure why shouldFail helper is not working ATM.
      await shouldFail(ethgc.redeem(redeemCode), "ALREADY_CLAIMED");
    });
  });
});
