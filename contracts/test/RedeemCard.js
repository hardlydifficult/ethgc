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
    let redeemCodePrivateKey, cardAddress
    let v, r, s

    before(async () => {
      redeemCodePrivateKey = ethgc.getPrivateKey(redeemCode)
      cardAddress = ethgc.getAddress(redeemCodePrivateKey)
      await ethgc.createCards(
        [cardAddress],
        [web3.utils.padLeft(0, 40)],
        [value]
      );
      [v, r, s] = await ethgc.sign(accounts[0], redeemCodePrivateKey)
    })

    it('should fail if the signature is not valid', async () => {
      await shouldFail(
        ethgc.redeemCard(cardAddress, v, r, '0x27'),
        'INVALID_REDEEM_CODE'
      )
    })

    it('Can redeem', async () => {
      const balance = await ethgc.hardlyWeb3.getEthBalance()
      const tx = await ethgc.redeemCard(cardAddress, v, r, s)
      console.log(`Redeem cost ${tx.gasUsed}`)
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(), 
        balance.plus(value).minus(gasCost).toFixed()
      )
    })

    it('shouldFail to claim a claimed code', async () => {
      await shouldFail(
        ethgc.redeemCard(cardAddress, v, r, s),
        "ALREADY_CLAIMED"
      )
    })
  })
})