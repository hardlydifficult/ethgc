const BigNumber = require("bignumber.js");
const shouldFail = require("./helpers/shouldFail");
const ethgcJs = require("../../library/ethgc.js");

contract("Fees", accounts => {
  let ethgc;

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[0]);
    ethgc.hardlyWeb3.switchAccount(accounts[0])
  });

  it("Can check the cost to create a card", async () => {
    const fees = await ethgc.getFeeRates();
    assert.equal(
      fees.createFee.toFixed(),
      new BigNumber(web3.utils.toWei("0.00005", "ether")).toFixed()
    );
  });

  describe("Owner functions", () => {
    before(async () => {
      ethgc.hardlyWeb3.switchAccount(accounts[0]);
    });

    after(async () => {
      ethgc.hardlyWeb3.switchAccount(accounts[1]);
    });

    describe("devSetFees", () => {
      let originalFees;

      before(async () => {
        originalFees = await ethgc.getFeeRates();
      });

      after(async () => {
        await ethgc.devSetFees(
          originalFees.createFee.toFixed(),
          originalFees.gasForEth.toFixed(),
          originalFees.gasForErc20.toFixed(),
          originalFees.gasForErc721.toFixed()
        );
      });

      it("Can change fee", async () => {
        await ethgc.devSetFees(
          1,
          originalFees.gasForEth.toFixed(),
          originalFees.gasForErc20.toFixed(),
          originalFees.gasForErc721.toFixed()
        );
      });

      it("Can read the new fee", async () => {
        assert.equal((await ethgc.getFeeRates()).createFee.toFixed(), 1);
      });
    });

    describe("withdraw", () => {
      let fees;

      before(async () => {
        // Creating a card so that there is some fees to collect
        await ethgc.create(
          [accounts[1]],
          [ethgc.hardlyWeb3.web3.utils.padLeft(0, 40)],
          [1]
        );
      });

      it("Can read fees collected", async () => {
        fees = await ethgc.getFeesCollected();
        assert(fees.gt(0));
        assert.equal(
          fees.toFixed(),
          (await ethgc.getFeeRates()).createFee.toFixed()
        );
      });

      it("Can withdraw", async () => {
        const balance = await ethgc.hardlyWeb3.getEthBalance();
        const tx = await ethgc.developerWithdrawFees();
        const gasCost = await ethgc.hardlyWeb3.getGasCost(tx);
        assert.equal(
          (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
          balance
            .plus(fees)
            .minus(gasCost)
            .toFixed()
        );
      });
    });
  });
});
