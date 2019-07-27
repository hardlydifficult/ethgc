const init = require('./helpers/init')

contract('Fees', accounts => {
  let ethgc

  before(async () => {
    ethgc = await init(accounts)
  })

  it('Can check the cost to create a card', async () => {
    //const fees = await ethgc.getFeeRates();
    // TODO test each rate
    // assert.equal(
    //   fees.gasForRedeem.toFixed(),
    //   new BigNumber(web3.utils.toWei("0.00005", "ether")).toFixed()
    // );
  })

  describe('Owner functions', () => {
    before(async () => {
      ethgc.hardlyWeb3.switchAccount(accounts[0])
    })

    after(async () => {
      ethgc.hardlyWeb3.switchAccount(accounts[1])
    })

    describe('devSetFees', () => {
      let originalFees

      before(async () => {
        originalFees = await ethgc.getFeeRates()
      })

      after(async () => {
        await ethgc.devSetFees(
          originalFees.gasForRedeem.toFixed(),
          originalFees.gasForEth.toFixed(),
          originalFees.gasForErc20.toFixed(),
          originalFees.gasForErc721.toFixed()
        )
      })

      it('Can change fee', async () => {
        await ethgc.devSetFees(
          1,
          originalFees.gasForEth.toFixed(),
          originalFees.gasForErc20.toFixed(),
          originalFees.gasForErc721.toFixed()
        )
      })

      it('Can read the new fee', async () => {
        assert.equal((await ethgc.getFeeRates()).gasForRedeem.toFixed(), 1)
      })
    })
  })
})
