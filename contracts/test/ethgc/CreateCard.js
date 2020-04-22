const init = require('./helpers/init')
const { constants } = require('hardlydifficult-ethereum-contracts')

contract('CreateCard', accounts => {
  let ethgc

  before(async () => {
    ethgc = await init(accounts)
  })

  describe('ETH card', () => {
    const redeemCode = 'abc123'
    let value
    let cardAddress

    before(async () => {
      value = ethgc.hardlyWeb3.toWei('0.1', 'ether')
      cardAddress = await ethgc.getCardAddress(redeemCode)

      await ethgc.create(
        [cardAddress],
        [constants.ZERO_ADDRESS],
        [value]
      )
    })

    it('Can read the card creator', async () => {
      const card = await ethgc.getCard(cardAddress)
      assert.equal(card.createdBy, accounts[0])
    })

    it('Can read token balances', async () => {
      const card = await ethgc.getCard(cardAddress)
      assert.equal(card.tokenAddresses.length, 1)
      assert.equal(card.valueOrIds.length, 1)
      assert.equal(card.tokenAddresses[0], constants.ZERO_ADDRESS)
      assert.equal(card.valueOrIds[0], value)
    })
  })
})
