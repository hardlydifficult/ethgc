const HardlyWeb3 = require('./hardlyWeb3.js')
const BigNumber = require('bignumber.js');
const fs = require('fs');

class ethgc 
{
  constructor(currentProvider, defaultAccount)
  {
    this.hardlyWeb3 = new HardlyWeb3(currentProvider, defaultAccount)
  }

  // TODO: there has to be a better way... right?
  async init()
  {
    const id = await this.hardlyWeb3.web3.eth.net.getId()
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
        this.contract = new this.hardlyWeb3.web3.eth.Contract(
          file.abi, file.address
        )
      }
    );
  }

  async createCard(token, value, redeemCodeHashHashHash)
  {
    return await this.contract.methods.createCard(
      token,
      value,
      redeemCodeHashHashHash
    ).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount,
        value: (await this.getCostToCreateCard()).plus(value).toFixed()
      }
    )
  }

  async claimCard(redeemCodeHashHash)
  {
    return await this.contract.methods.claimCard(redeemCodeHashHash).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    );
  }

  async redeemGift(redeemCodeHash)
  {
    return await this.contract.methods.redeemGift(redeemCodeHash).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    );
  }

  async ownerChangeFee(costToCreateCard)
  {
    return await this.contract.methods.ownerChangeFee(costToCreateCard).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async ownerWithdrawFees()
  {
    return await this.contract.methods.ownerWithdrawFees().send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async getCostToCreateCard()
  {
    return new BigNumber(await this.contract.methods.costToCreateCard().call(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    ));
  }

  async getCardByHashHashHash(redeemCodeHashHashHash)
  {
    return await this.contract.methods.redeemCodeHashHashHashToCard(
      redeemCodeHashHashHash
    ).call(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async getFeesCollected()
  {
    return new BigNumber(await this.contract.methods.feesCollected().call(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    ))
  }
}

module.exports = ethgc;