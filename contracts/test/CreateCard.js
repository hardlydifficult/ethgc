const BigNumber = require("bignumber.js");
const init = require("./helpers/init");

contract("CreateCard", accounts => {
  let ethgc;

  before(async () => {
    ethgc = await init(accounts);
  });

  describe("ETH card", () => {
    const redeemCode = "abc123";
    let value;
    let cardAddress;

    before(async () => {
      value = ethgc.hardlyWeb3.toWei("0.1", "ether");
      cardAddress = await ethgc.getCardAddress(redeemCode);

      const tx = await ethgc.create(
        [cardAddress],
        [web3.utils.padLeft(0, 40)],
        [value]
      );
      const gasUsed = await ethgc.hardlyWeb3.getGasCost(tx);
      const createFee = new BigNumber(tx.request.value).minus(value);
      console.log(
        `Create cost ${ethgc.hardlyWeb3.fromWei(
          createFee.toFixed()
        )} ETH + ${ethgc.hardlyWeb3.fromWei(gasUsed.toFixed())} ETH gas`
      );
    });

    it("Can read the card creator", async () => {
      const card = await ethgc.getCard(cardAddress);
      assert.equal(card.createdBy, accounts[0]);
    });

    it("Can read token balances", async () => {
      const card = await ethgc.getCard(cardAddress);
      assert.equal(card.tokenAddresses.length, 1);
      assert.equal(card.valueOrIds.length, 1);
      assert.equal(card.tokenAddresses[0], web3.utils.padLeft(0, 40));
      assert.equal(card.valueOrIds[0], value);
    });
  });
});
