const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('CreateCard', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[0])
    await ethgc.init()
  })
  
  describe('ETH card', () => {
    const redeemCode = 'abc123'
    const value = 42
    let redeemCodePrivateKey, redeemCodeAddress

    before(async () => {
      redeemCodePrivateKey = ethgc.getPrivateKey(redeemCode)
      redeemCodeAddress = ethgc.getAddress(redeemCodePrivateKey)
      const tx = await ethgc.createCard(
        web3.utils.padLeft(0, 40),
        value,
        redeemCodeAddress
      )
      console.log(`Create cost ${tx.gasUsed}`)
    })

    it('Can read an available card', async () => {
      const card = await ethgc.getCardByAddress(redeemCodeAddress)
      assert.equal(card.createdBy, accounts[0])
      assert.equal(card.token, web3.utils.padLeft(0, 40))
      assert.equal(card.valueOrTokenId, value)
    })
  })
})