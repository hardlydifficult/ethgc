const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('CreateCard', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[0])
  })
  
  describe('ETH card', () => {
    const redeemCode = 'abc123'
    const value = 42
    let redeemCodePrivateKey, cardAddress

    before(async () => {
      redeemCodePrivateKey = await ethgc.getPrivateKey(redeemCode)
      cardAddress = await ethgc.getAddressByPrivateKey(redeemCodePrivateKey)

      const tx = await ethgc.createCards(
        [cardAddress],
        [web3.utils.padLeft(0, 40)],
        [value]
      )
      console.log(`Create cost ${tx.gasUsed}`)
    })

    it('Can read the card creator', async () => {
      const card = await ethgc.getCardByAddress(cardAddress)
      assert.equal(card.createdBy, accounts[0])
    })
    
    it('Can read token balances', async () => {
      const card = await ethgc.getCardByAddress(cardAddress) 
      assert.equal(card.tokenAddresses.length, 1);
      assert.equal(card.valueOrIds.length, 1)
      assert.equal(card.tokenAddresses[0], web3.utils.padLeft(0, 40))
      assert.equal(card.valueOrIds[0], value)
    })
  })
})