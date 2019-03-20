const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('CardCreator', (accounts) => {
  const redeemCode = 'abc123'
  const value = 42
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[0])
    await ethgc.init()
  })
  
  describe('For cards I created', () => {
    let cardAddress

    before(async () => {
      const redeemCodePrivateKey = ethgc.getPrivateKey(redeemCode)
      cardAddress = ethgc.getAddress(redeemCodePrivateKey)
      await ethgc.createCard(
        web3.utils.padLeft(0, 40),
        value,
        cardAddress
      )
    })

    it('can cancel the card and get the ETH back', async () => {
      const balanceBefore = await ethgc.hardlyWeb3.getEthBalance()
      let tx = await ethgc.cancelCards([cardAddress])
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balanceBefore.plus(value).minus(gasCost).toFixed()
      )
    })
  })

  describe('For cards others created', () => {
    const value = 42
    let cardAddress

    before(async () => {
      const redeemCodePrivateKey = ethgc.getPrivateKey(redeemCode)
      cardAddress = ethgc.getAddress(redeemCodePrivateKey)
      ethgc.hardlyWeb3.switchAccount(accounts[2])
      await ethgc.createCard(
        web3.utils.padLeft(0, 40),
        value,
        cardAddress
      )
      ethgc.hardlyWeb3.switchAccount(accounts[0])
    })

    it('cancel card should be a noop', async () => {
      const balanceBefore = await ethgc.hardlyWeb3.getEthBalance()
      let tx = await ethgc.cancelCards([cardAddress])
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(),
        balanceBefore.minus(gasCost).toFixed()
      )
    })
  })
})