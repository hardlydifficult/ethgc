const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('RedeemCard', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[0])
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

   
    it('Can claim', async () => {
      const tx = await ethgc.claimCard(redeemCodeHashHash)
      console.log(`Claim cost ${tx.gasUsed}`)
    })

    it('shouldFail to claim a claimed code', async () => {
      await shouldFail(ethgc.claimCard(redeemCodeHashHash), "ALREADY_CLAIMED")
    })

    it('Can redeem', async () => {
      const balance = await ethgc.hardlyWeb3.getEthBalance()
      const tx = await ethgc.redeemGift(redeemCodeHash)
      console.log(`Redeem cost ${tx.gasUsed}`)
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(), 
        balance.plus(value).minus(gasCost).toFixed()
      )
    })
  })

})