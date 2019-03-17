const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const fs = require('fs');

class ethgc 
{
  constructor(currentProvider, defaultAccount)
  {
    this.web3 = new Web3(currentProvider);
    this.switchAccount(defaultAccount)
  }
  
  switchAccount(account)
  {
    this.web3.defaultAccount = account;
  }

  // TODO: there has to be a better way... right?
  async init()
  {
    const id = await this.web3.eth.net.getId()
    fs.readFile(
      `../library/abi/${id}.json`,
      'utf8',
      (err, file) => 
      {
        if(err)
        {
          throw new Error(err);
        }
        file = JSON.parse(file);
        this.contract = new this.web3.eth.Contract(file.abi, file.address,
          {
            from: this.web3.defaultAccount
          }
        )
      }
    );
  }

  async getCostToCreateCard()
  {
    return new BigNumber(await this.contract.methods.costToCreateCard().call());
  }

  async createCard(token, value, redeemCodeHashHashHash)
  {
    return await this.contract.methods.createCard(
      token,
      value,
      redeemCodeHashHashHash
    ).send(
      {
        value: (await this.getCostToCreateCard()).plus(value).toFixed()
      }
    )
  }

  async getCardByHashHashHash(redeemCodeHashHashHash)
  {
    return await this.contract.methods.redeemCodeHashHashHashToCard(
      redeemCodeHashHashHash
    ).call()
  }

  async getFeesCollected()
  {
    return new BigNumber(await this.contract.methods.feesCollected().call())
  }
}

module.exports = ethgc;