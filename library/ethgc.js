const HardlyWeb3 = require('./hardlyWeb3.js')
const BigNumber = require('bignumber.js')

class ethgc 
{
  constructor(currentProvider, defaultAccount)
  {
    this.hardlyWeb3 = new HardlyWeb3(currentProvider, defaultAccount)
  }

  async _init()
  {
    if(this.contract) return
    const id = await this.hardlyWeb3.web3.eth.net.getId()
    const file = require(`./abi/${id}.json`)
    this.contract = new this.hardlyWeb3.web3.eth.Contract(
      file.abi, file.address
    )
  }

  async createCards(
    cardAddresses,
    tokenAddresses,
    valueOrIds,
    description = '',
    redeemedMessage = ''
  )
  {
    await this._init()
    let ethValue = (await this.getCostToCreateCard()).times(cardAddresses.length)
    for(let i = 0; i < tokenAddresses.length; i++)
    {
      if(!tokenAddresses[i])
      {
        tokenAddresses[i] = this.hardlyWeb3.web3.utils.padLeft(0, 40);
      }
      if(tokenAddresses[i] === this.hardlyWeb3.web3.utils.padLeft(0, 40))
      {
        ethValue = ethValue.plus(valueOrIds[i]).times(cardAddresses.length)
      }
    }
    return await this.contract.methods.createCards(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      description,
      redeemedMessage
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
    await this._init()
    const sig = this.hardlyWeb3.web3.eth.accounts.privateKeyToAccount(redeemCodePrivateKey)
      .sign(this.hardlyWeb3.web3.utils.keccak256(
        this.contract.options.address + account.substring(2)
      ))
    return [sig.v, sig.r, sig.s]
  }

  async redeemCards(cardAddresses, v, r, s, tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  {
    await this._init()
    if(tokenAddress == -1)
    {
      tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    }
    return await this.contract.methods.redeemCards(cardAddresses, v, r, s, tokenAddress).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async cancelCards(cardAddresses, tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  {
    await this._init()
    if(tokenAddress == -1)
    {
      tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    }
    return await this.contract.methods.cancelCards(cardAddresses, tokenAddress).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async developerSetCostToCreateCard(costToCreateCard)
  {
    await this._init()
    return await this.contract.methods.developerSetCostToCreateCard(costToCreateCard).send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async developerWithdrawFees()
  {
    await this._init()
    return await this.contract.methods.developerWithdrawFees().send(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async getPrivateKey(redeemCode)
  {
    if(!redeemCode) return
    await this._init()
    const code = this.contract.options.address + redeemCode;
    return this.hardlyWeb3.web3.utils.keccak256(code)
  }

  async getAddressByPrivateKey(privateKey)
  {
    if(!privateKey) return
    await this._init()
    return (await this.hardlyWeb3.web3.eth.accounts.privateKeyToAccount(privateKey)).address
  }

  async getAddressByCode(redeemCode)
  {
    if(!redeemCode) return
    await this._init()
    return await this.getAddressByPrivateKey(await this.getPrivateKey(redeemCode))
  }

  async getAddressIsAvailableByCode(redeemCode)
  {
    
    if(!redeemCode) return
    await this._init()
    const address = await this.getAddressByCode(redeemCode)
    return !(await this.getCard(address))
  }

  async getCostToCreateCard()
  {
    await this._init()
    return new BigNumber(await this.contract.methods.costToCreateCard().call(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    ))
  }

  async getCard(cardAddress)
  {
    if(!cardAddress) return
    await this._init()
    return await this.contract.methods.getCard(
      cardAddress
    ).call(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
  }

  async getFeesCollected()
  {
    await this._init()
    return new BigNumber(await this.contract.methods.feesCollected().call(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    ))
  }
}

module.exports = ethgc