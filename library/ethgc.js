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
    return {v: sig.v, r: sig.r, s: sig.s}
  }

  async redeemCardsByCodes(codes, tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  {
    await this._init()
    const cardAddresses = []
    const v = []
    const r = []
    const s = []

    for(let i = 0; i < codes.length; i++)
    {
      const privateKey = await this.getPrivateKey(codes[i].redeemCode)
      cardAddresses.push(await this.getAddressByPrivateKey(privateKey))
      const sig = await this.sign(this.hardlyWeb3.web3.defaultAccount, privateKey)
      v.push(sig.v)
      r.push(sig.r)
      s.push(sig.s)
    }

    return await this.redeemCards(cardAddresses, v, r, s, tokenAddress)
  }

  async redeemCards(cardAddresses, v, r, s, tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  {
    await this._init()
    if(tokenAddress == -1)
    {
      tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    }
    console.log('Redeeming: ', cardAddresses)
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
    console.log(await this.getPrivateKey(redeemCode))
    return await this.getAddressByPrivateKey(await this.getPrivateKey(redeemCode))
  }

  async getAddressIsAvailableByCode(redeemCode)
  {
    if(!redeemCode) return
    await this._init()
    const address = await this.getAddressByCode(redeemCode)
    return !(await this.getCardByAddress(address))
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

  async getCardByCode(redeemCode)
  {
    if(!redeemCode) return
    await this._init()
    const address = await this.getAddressByCode(redeemCode)
    console.log('card',address)
    return this.getCardByAddress(address)
  }

  async getCardByAddress(cardAddress)
  {
    if(!cardAddress) return
    await this._init()
    const card = await this.contract.methods.getCard(
      cardAddress
    ).call(
      {
        from: this.hardlyWeb3.web3.defaultAccount
      }
    )
    if(card.createdBy === this.hardlyWeb3.web3.utils.padLeft(0, 40))
    {
      return null
    }
    return card
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

  async getCardMessages(redeemCode)
  {
    if(!redeemCode) return
    await this._init()
    const address = await this.getAddressByCode(redeemCode)
    const results = await this.contract.getPastEvents('CreateCard', {
      filter: {redeemCode: address}, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0,
      toBlock: 'latest'
    })
    if (results.length > 0) {
      const tx = results[0].transactionHash
      const request = await this.hardlyWeb3.web3.eth.getTransaction(tx)
      /**
       *
       *
0xa509d92f - `0x` then keccak256(function signature).substr
00000000000000000000000000000000000000000000000000000000000000a0 - sizeof(address)
00000000000000000000000000000000000000000000000000000000000001c0 - 448???
0000000000000000000000000000000000000000000000000000000000000200 - 512? sizeof(uint)*length maybe
0000000000000000000000000000000000000000000000000000000000000240 - 576? 512 + 64
0000000000000000000000000000000000000000000000000000000000000280 - 640?
0000000000000000000000000000000000000000000000000000000000000008 - length (cardAddresses)
0000000000000000000000001bac8654177e631d982dc0904a135d9198757eff -- cardAddress
0000000000000000000000005a6f3aa67848c6e3075280fb20744df0affe3a5b --
0000000000000000000000001f49e1ca253b3443e2b5b903dceeccab5e98349d
0000000000000000000000005df5e6c1d030cf77ffc162ccbaa2ef661ba1d8c2
000000000000000000000000282a171d19af6164dfd9c4a28a1cf3f6537a6c65
000000000000000000000000c042dab5bf5b5f836e190cb390c2b52e1cc136d9
0000000000000000000000000b36f5b16163ddf05d71599a5c296bd32649fa3f
0000000000000000000000008ec439b002e6a33459b093b0fef32778882e3bc0 --
0000000000000000000000000000000000000000000000000000000000000001 -- length tokenAddresses
0000000000000000000000000000000000000000000000000000000000000000 - tokenaddress?
0000000000000000000000000000000000000000000000000000000000000001 - length of valueOrIds?
0000000000000000000000000000000000000000000000004563918244f40000 - value - 5 ether
000000000000000000000000000000000000000000000000000000000000000e - 14 characters
7468697320697320612074657374 - 'this is a test'
000000000000000000000000000000000000 - padding
000000000000000000000000000000000000000000000000000000000000000d - 13 characters
697420776f726b6564205c6f2f - 'it worked \o/'
00000000000000000000000000000000000000 - padding

x address[] calldata cardAddresses, // one per card
256 length then 160 per address (or 256?)
x address[] calldata tokenAddresses,
256 length then 160 per address (or 256?)
x uint[] calldata valueOrIds, // one per token
256 length then 256 per value

Skip

!string calldata description,
256 length then bytes rounded up to nearest 256
!string calldata redeemedMessage
256 length then bytes rounded up to nearest 256
       */
      //return request.input
      let i = new BigNumber(10 + 64 * 5)
      let cardCount = new BigNumber(request.input.substr(i.toNumber(), 64), 16)
      i = i.plus(cardCount.plus(1).times(64))
      let tokenAddressCount = new BigNumber(request.input.substr(i.toNumber(), 64), 16)
      i = i.plus(tokenAddressCount.plus(1).times(64))
      let tokenValueCount = new BigNumber(request.input.substr(i.toNumber(), 64), 16)
      i = i.plus(tokenValueCount.plus(1).times(64))
      let descriptionLength = new BigNumber(request.input.substr(i.toNumber(), 64), 16)
      i = i.plus(64)
      let description = request.input.substr(i.toNumber(), descriptionLength * 2)
      i = i.plus(descriptionLength.plus(63).div(64).integerValue().times(64))
      let redeemedMessageLength = new BigNumber(request.input.substr(i.toNumber(), 64), 16)
      i = i.plus(64)
      let redeemedMessage = request.input.substr(i.toNumber(), redeemedMessageLength * 2)
      return {
        description: hex_to_ascii(description),
        redeemedMessage: hex_to_ascii(redeemedMessage)
      }
    }
  }
}

function sleep (ms) { // todo remove
  return new Promise(resolve => setTimeout(resolve, ms))
}

function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

module.exports = ethgc