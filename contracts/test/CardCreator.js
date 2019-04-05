const BigNumber = require("bignumber.js");
const shouldFail = require("./helpers/shouldFail");
const ethgcJs = require("../../library/ethgc.js");

contract("CardCreator", accounts => {
  const redeemCode = "abc123";
  const value = 42;
  let ethgc;

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider);
    ethgc.hardlyWeb3.switchAccount(accounts[0])
  });

  describe("For cards I created", () => {
    let cardAddress;

    before(async () => {
      cardAddress = await ethgc.getCardAddress(redeemCode);

      const tx = await ethgc.create(
        [cardAddress],
        [web3.utils.padLeft(0, 40)],
        [value]
      );
    });

    it("can cancel the card and get the ETH back", async () => {
      const balanceBefore = await ethgc.hardlyWeb3.getEthBalance();
      const tx = await ethgc.cancel([cardAddress]);
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx);
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balanceBefore
          .plus(value)
          .minus(gasCost)
          .toFixed()
      );
    });
  });

  describe("For cards others created", () => {
    const value = 42;
    let cardAddress;

    before(async () => {
      cardAddress = await ethgc.getCardAddress(redeemCode);

      ethgc.hardlyWeb3.switchAccount(accounts[2]);
      const tx = await ethgc.create(
        [cardAddress],
        [web3.utils.padLeft(0, 40)],
        [value]
      );
      ethgc.hardlyWeb3.switchAccount(accounts[0]);
    });

    it("cancel card should be a noop", async () => {
      const balanceBefore = await ethgc.hardlyWeb3.getEthBalance();
      const tx = await ethgc.cancel([cardAddress]);
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx);
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balanceBefore.minus(gasCost).toFixed()
      );
    });
  });
});
