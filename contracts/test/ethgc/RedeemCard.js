const init = require('./helpers/init')
const { reverts } = require('truffle-assertions')
const { constants } = require('hardlydifficult-ethereum-contracts')

contract('RedeemCard', accounts => {
  let ethgc

  beforeEach(async () => {
    ethgc = await init(accounts)
  })

  describe('ETH card', () => {
    const redeemCode = 'abc123'
    const value = 42

    beforeEach(async () => {
      const cardAddress = await ethgc.getCardAddress(redeemCode)
      await ethgc.create([cardAddress], [constants.ZERO_ADDRESS], [value])
    })

    describe('after redeem', async () => {
      let balanceBefore

      beforeEach(async () => {
        balanceBefore = await ethgc.hardlyWeb3.getEthBalance()
        await ethgc.redeem(redeemCode)
      })

      it('Balance went up', async () => {
        assert.equal(
          (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
          balanceBefore.plus(value).toFixed()
        )
      })

      it('shouldFail to claim a claimed code', async () => {
        await reverts(ethgc.redeem(redeemCode), 'ALREADY_CLAIMED')
      })
    })
  })
})
