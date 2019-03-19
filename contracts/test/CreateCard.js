const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('CreateCard', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[9])
    await ethgc.init()
  })
  
  describe('ETH card', () => {
    const redeemCode = 'abc123'
    const value = 42
    const redeemCodeHash = web3.utils.keccak256(redeemCode)
    const redeemCodeHashHash = web3.utils.keccak256(redeemCodeHash)
    const redeemCodeHashHashHash = web3.utils.keccak256(redeemCodeHashHash)

    before(async () => {
      const tx = await ethgc.createCard(
        web3.utils.padLeft(0, 40),
        value,
        redeemCodeHashHashHash
      )
      console.log(`Create cost ${tx.gasUsed}`)
    })

    it('Can read an available card', async () => {
      const card = await ethgc.getCardByHashHashHash(redeemCodeHashHashHash)
      assert.equal(card.token, web3.utils.padLeft(0, 40))
      assert.equal(card.valueOrTokenId, value)
      assert.equal(card.claimedBy, web3.utils.padLeft(0, 40))
      assert.equal(card.claimedAtTime, 0)
    })

  })

})