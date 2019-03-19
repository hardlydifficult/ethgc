const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('Fees', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[9])
    await ethgc.init()
  })
  
  describe('Owner functions', () => {
    before(async () => {
      ethgc.hardlyWeb3.switchAccount(accounts[0])
    })

    after(async () => {
      ethgc.hardlyWeb3.switchAccount(accounts[1])
    })


    describe('ownerChangeFee', () => {
      let originalFee

      before(async () => {
        originalFee = await ethgc.getCostToCreateCard()
      })

      after(async () => {
        await ethgc.ownerChangeFee(originalFee.toFixed())
      })

      it('Can change fee', async () => {
        await ethgc.ownerChangeFee(1)
      })

      it('Can read the new fee', async () => {
        assert.equal(
          (await ethgc.getCostToCreateCard()).toFixed(), 
          1
        )
      })
    })

    describe('withdraw', () => {
      let fees

      it('Can read fees collected', async () => {
        fees = await ethgc.getFeesCollected()
        assert(fees.gt(0))
        assert.equal(
          fees.toFixed(),
          (await ethgc.getCostToCreateCard()).toFixed()
        )
      })

      it('Can withdraw', async () => {
        const balance = await ethgc.hardlyWeb3.getEthBalance()
        let tx = await ethgc.ownerWithdrawFees()
        const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
        assert.equal(
          (await ethgc.hardlyWeb3.getEthBalance()).toFixed(), 
          balance.plus(fees).minus(gasCost).toFixed()
        )
      })
    })
  })
})
