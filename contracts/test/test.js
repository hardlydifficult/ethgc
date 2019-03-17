const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js');
const ethgcJs = require('../../library/ethgc.js');

contract('test', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[1]);
    await ethgc.init();
  })

  it('Can check the cost to create a card', async () => {
    const cost = await ethgc.getCostToCreateCard();
    assert.equal(
      cost.toFixed(), 
      new BigNumber(web3.utils.toWei('0.00005', 'ether')).toFixed()
    )
  })

  describe('ETH card', () => {
    const redeemCode = 'abc123'
    const value = 42
    const redeemCodeHash = web3.utils.keccak256(redeemCode);
    const redeemCodeHashHash = web3.utils.keccak256(redeemCodeHash);
    const redeemCodeHashHashHash = web3.utils.keccak256(redeemCodeHashHash);

    before(async () => {
      await ethgc.createCard(
        web3.utils.padLeft(0, 40),
        value,
        redeemCodeHashHashHash
      )
    })

    it('Can read an available card', async () => {
      const card = await ethgc.getCardByHashHashHash(redeemCodeHashHashHash)
      assert.equal(card.token, web3.utils.padLeft(0, 40))
      assert.equal(card.valueOrTokenId, value)
      assert.equal(card.claimedBy, web3.utils.padLeft(0, 40))
      assert.equal(card.claimedAtTime, 0)
    })

    it('Can claim', async () => {
      await ethgc.claimCard(redeemCodeHashHash)
    })

    it('shouldFail to claim a claimed code', async () => {
      await shouldFail(ethgc.claimCard(redeemCodeHashHash), "ALREADY_CLAIMED");
    })

    it('Can redeem', async () => {
      const balance = await ethgc.hardlyWeb3.getEthBalance()
      const tx = await ethgc.redeemGift(redeemCodeHash)
      const gasCost = await ethgc.hardlyWeb3.getGasCost(tx)
      assert.equal(
        (await ethgc.hardlyWeb3.getEthBalance()).toFixed(), 
        balance.plus(value).minus(gasCost).toFixed()
      )
    })
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
        originalFee = await ethgc.getCostToCreateCard();
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