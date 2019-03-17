const BigNumber = require('bignumber.js');
const ethgcJs = require('../../library/ethgc.js');

contract('test', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[0]);
    await ethgc.init();
  })

  it('can check the cost to create a card', async () => {
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

    it('Can read card', async () => {
      const card = await ethgc.getCardByHashHashHash(redeemCodeHashHashHash)
      assert.equal(card.token, web3.utils.padLeft(0, 40))
      assert.equal(card.valueOrTokenId, value)
      assert.equal(card.claimedBy, web3.utils.padLeft(0, 40))
      assert.equal(card.claimedAtTime, 0)
    })

    it('Can read fees collected', async () => {
      const fees = await ethgc.getFeesCollected()
      assert(fees.gt(0))
      assert.equal(fees.toFixed(), (await ethgc.getCostToCreateCard()).toFixed())
    })
  })
})