const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const ethgcJs = require('../../library/ethgc.js')

contract('CardCreator', (accounts) => {
  let ethgc

  before(async () => {
    ethgc = new ethgcJs(web3.currentProvider, accounts[0])
    await ethgc.init()
  })
  
  // TODO
})