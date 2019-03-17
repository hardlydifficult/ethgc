const Web3 = require('web3')
const BigNumber = require('bignumber.js')

class HardlyWeb3
{
  constructor(currentProvider, defaultAccount)
  {
    this.web3 = new Web3(currentProvider)
    this.switchAccount(defaultAccount)
  }
  
  switchAccount(account)
  {
    this.web3.defaultAccount = account
  }

  async getEthBalance(account = this.web3.defaultAccount)
  {
    return new BigNumber(await web3.eth.getBalance(account))
  }

  async getGasCost(txReceipt)
  {
    const txRequest = await web3.eth.getTransaction(txReceipt.transactionHash)
    return new BigNumber(txRequest.gasPrice).times(txReceipt.gasUsed)
  }
}

module.exports = HardlyWeb3