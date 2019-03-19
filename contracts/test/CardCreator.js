const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('CardCreator', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[9])
    await ethgc.init()
  })
  
  it('Can check the cost to create a card', async () => {
    const cost = await ethgc.getCostToCreateCard()
    assert.equal(
      cost.toFixed(), 
      new BigNumber(web3.utils.toWei('0.00005', 'ether')).toFixed()
    )
  })
})