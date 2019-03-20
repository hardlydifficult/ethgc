const HardlyWeb3 = require('./hardlyWeb3.js')
const BigNumber = require('bignumber.js')
const fs = require('fs')

class ethgc 
{
  constructor(currentProvider, defaultAccount)
  {
    this.hardlyWeb3 = new HardlyWeb3(currentProvider, defaultAccount)
  }

  // TODO: Is there an alternative to init after construction?
  async init()
  {
    const id = await this.hardlyWeb3.web3.eth.net.getId()
    const file = JSON.parse(fs.readFileSync(
      `../library/abi/${id}.json`,
      'utf8'))
    this.contract = new this.hardlyWeb3.web3.eth.Contract(
      file.abi, file.address
    )
  }

  getPrivateKey(redeemCode)
  {
    const code = this.contract.options.address + redeemCode;
    return this.hardlyWeb3.web3.utils.keccak256(code)
  }

  getAddress(privateKey)
  {
    return this.hardlyWeb3.web3.eth.accounts.privateKeyToAccount(privateKey).address
  }

  async createCard(token, value, redeemCodeAddress, message = '')
  {
    if(!token)
    {
      token = this.hardlyWeb3.web3.utils.padLeft(0, 40);
    }
    let ethValue = await this.getCostToCreateCard()
    if(token == this.hardlyWeb3.web3.utils.padLeft(0, 40))
    {
      ethValue = ethValue.plus(value)
    }
    return await this.contract.methods.createCard(
      token,
      value,
      redeemCodeAddress,
      message
    ).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount,
        value: ethValue.toFixed(),
        gas: 5000000
      }
    )
  }

  async sign(account, redeemCodePrivateKey)
  {
    const sig = this.hardlyWeb3.web3.eth.accounts.privateKeyToAccount(redeemCodePrivateKey)
      .sign(this.hardlyWeb3.web3.utils.keccak256(
        this.contract.options.address + account.substring(2)
      ))
    return [sig.v, sig.r, sig.s]
  }

  async redeem(redeemCodeAddress, v, r, s)
  {
    return await this.contract.methods.redeem(redeemCodeAddress, v, r, s).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async developerSetCostToCreateCard(costToCreateCard)
  {
    return await this.contract.methods.developerSetCostToCreateCard(costToCreateCard).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async developerWithdrawFees()
  {
    return await this.contract.methods.developerWithdrawFees().send(
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
    ))
  }

  async getCardByAddress(redeemCodeAddress)
  {
    return await this.contract.methods.redeemCodeAddressToCard(
      redeemCodeAddress
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

module.exports = ethgc