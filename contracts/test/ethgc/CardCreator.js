const init = require('./helpers/init')
const { constants } = require('hardlydifficult-eth')

contract('CardCreator', accounts => {
  const redeemCode = 'abc123'
  const value = 42
  let ethgc

  before(async () => {
    ethgc = await init(accounts)
  })

  describe('For cards I created', () => {
    let cardAddress

    before(async () => {
      cardAddress = await ethgc.getCardAddress(redeemCode)

      await ethgc.create([cardAddress], [constants.ZERO_ADDRESS], [value])
    })

    it('can cancel the card and get the ETH back', async () => {
      const balanceBefore = await ethgc.hardlyWeb3.getEthBalance()
      const tx = await ethgc.cancel([cardAddress])
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balanceBefore
          .plus(value)
          .minus(gasCost)
          .toFixed()
      )
    })
  })

  describe('For cards others created', () => {
    const value = 42
    let cardAddress

    before(async () => {
      cardAddress = await ethgc.getCardAddress(redeemCode)

      ethgc.hardlyWeb3.switchAccount(accounts[2])
      await ethgc.create([cardAddress], [constants.ZERO_ADDRESS], [value])
      ethgc.hardlyWeb3.switchAccount(accounts[0])
    })

    it('cancel card should be a noop', async () => {
      const balanceBefore = await ethgc.hardlyWeb3.getEthBalance()
      const tx = await ethgc.cancel([cardAddress])
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balanceBefore.minus(gasCost).toFixed()
      )
    })
  })
})
