const init = require('./helpers/init')
const shouldFail = require('../helpers/shouldFail')

contract('RedeemCard', accounts => {
  let ethgc

  before(async () => {
    ethgc = await init(accounts)
  })

  describe('ETH card', () => {
    const redeemCode = 'abc123'
    const value = 42

    before(async () => {
      const cardAddress = await ethgc.getCardAddress(redeemCode)

      await ethgc.create([cardAddress], [web3.utils.padLeft(0, 40)], [value])
    })

    it('Can redeem', async () => {
      const balance = await ethgc.hardlyWeb3.getEthBalance()
      await ethgc.redeem(redeemCode)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balance.plus(value).toFixed()
      )
    })

    it.skip('shouldFail to claim a claimed code', async () => {
      // not sure why shouldFail helper is not working ATM.
      await shouldFail(ethgc.redeem(redeemCode), 'ALREADY_CLAIMED')
    })
  })
})
