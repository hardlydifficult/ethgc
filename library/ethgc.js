const HardlyWeb3 = require("./hardlyWeb3.js");
const BigNumber = require("bignumber.js");

class ethgc {
  //#region Init
  constructor(currentProvider, defaultAccount) {
    this.hardlyWeb3 = new HardlyWeb3(currentProvider, defaultAccount);
  }

  async _init() {
    if (this.contract) return;
    const id = await this.hardlyWeb3.web3.eth.net.getId();
    const file = require(`./abi/${id}.json`);
    this.contract = new this.hardlyWeb3.web3.eth.Contract(
      file.abi,
      file.address
    );
  }
  //#endregion

  //#region Create / Contribute x
  async create(
    cardAddresses,
    tokenAddresses,
    valueOrIds,
    description = "",
    redeemedMessage = ""
  ) {
    await this._init();
    let ethValue = await this.calcEthRequired(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      true
    );

    return new Promise((resolve, reject) => {
      this.contract.methods
        .create(
          cardAddresses,
          tokenAddresses,
          valueOrIds,
          description,
          redeemedMessage
        )
        .send({
          from: this.hardlyWeb3.web3.defaultAccount,
          value: ethValue.toFixed(),
          gas: 5000000
        })
        .on("transactionHash", tx => {
          resolve(tx);
        })
        .on("error", error => {
          reject(error);
        });
    });
  }

  async calcEthRequired(cardAddresses, tokenAddresses, valueOrIds, isNewCard) {
    const { totalCreateFee, redemptionGas } = await this.getFees(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      isNewCard
    );
    let ethValue = totalCreateFee.plus(redemptionGas);
    for (let i = 0; i < tokenAddresses.length; i++) {
      if (!tokenAddresses[i]) {
        tokenAddresses[i] = this.hardlyWeb3.web3.utils.padLeft(0, 40);
      }
      if (tokenAddresses[i] === this.hardlyWeb3.web3.utils.padLeft(0, 40)) {
        ethValue = ethValue.plus(valueOrIds[i]).times(cardAddresses.length);
      }
    }
    return ethValue;
  }

  async contribute(cardAddresses, tokenAddresses, valueOrIds) {
    await this._init();
    let ethValue = await this.calcEthRequired(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      false
    );
    return await this.contract.methods
      .contribute(cardAddresses, tokenAddresses, valueOrIds)
      .send({
        from: this.hardlyWeb3.web3.defaultAccount,
        value: ethValue.toFixed(),
        gas: 5000000
      });
  }

  async getFeeRates() {
    await this._init();
    const [createFee, gasForEth, gasForErc20, gasForErc721] = await Promise.all(
      [
        this.contract.methods
          .createFee()
          .call({ from: this.hardlyWeb3.web3.defaultAccount }),
        this.contract.methods
          .gasForEth()
          .call({ from: this.hardlyWeb3.web3.defaultAccount }),
        this.contract.methods
          .gasForErc20()
          .call({ from: this.hardlyWeb3.web3.defaultAccount }),
        this.contract.methods
          .gasForErc721()
          .call({ from: this.hardlyWeb3.web3.defaultAccount })
      ]
    );
    return {
      createFee: new BigNumber(createFee),
      gasForEth: new BigNumber(gasForEth),
      gasForErc20: new BigNumber(gasForErc20),
      gasForErc721: new BigNumber(gasForErc721)
    };
  }

  async getFees(cardAddresses, tokenAddresses, valueOrIds, isNewCard) {
    await this._init();
    const {
      totalCreateFee,
      redemptionGas
    } = await this.contract.methods
      .getFees(cardAddresses, tokenAddresses, valueOrIds, isNewCard)
      .call({ from: this.hardlyWeb3.web3.defaultAccount });
    return {
      totalCreateFee: new BigNumber(totalCreateFee),
      redemptionGas: new BigNumber(redemptionGas)
    };
  }
  //#endregion

  //#region Viewing cards
  async getCardAddress(redeemCode) {
    if (!redeemCode) return;
    await this._init();
    return await this._getAddressByPrivateKey(
      await this._getPrivateKey(redeemCode)
    );
  }

  async getCard(cardAddress) {
    if (!cardAddress) return;
    await this._init();
    const card = await this.contract.methods.getCard(cardAddress).call({
      from: this.hardlyWeb3.web3.defaultAccount
    });
    if (card.createdBy === this.hardlyWeb3.web3.utils.padLeft(0, 40)) {
      return null;
    }
    return card;
  }
  //#endregion

  //#region Redeem cards
  async redeem(redeemCode, sendTo) {
    if (tokenAddress == -1) {
      tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
    }
    await this._init();
    const privateKey = await this._getPrivateKey(redeemCode);
    return await this.contract.methods.redeem(sendTo, tokenAddress).send({
      from: privateKey
    });
  }

  async redeemWithSignature(
    redeemCodes,
    tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    if (tokenAddress == -1) {
      tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
    }
    await this._init();
    const cardAddresses = [];
    const v = [];
    const r = [];
    const s = [];

    for (let i = 0; i < redeemCodes.length; i++) {
      const privateKey = await this._getPrivateKey(redeemCodes[i].redeemCode);
      cardAddresses.push(await this.getAddressByPrivateKey(privateKey));
      const sig = await this._sign(
        this.hardlyWeb3.web3.defaultAccount,
        privateKey
      );
      v.push(sig.v);
      r.push(sig.r);
      s.push(sig.s);
    }

    return await this.contract.methods
      .redeemWithSignature(cardAddresses, v, r, s, tokenAddress)
      .send({
        from: this.hardlyWeb3.web3.defaultAccount
      });
  }

  async cancel(
    cardAddresses,
    tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    await this._init();
    if (tokenAddress == -1) {
      tokenAddress = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
    }
    return await this.contract.methods
      .cancel(cardAddresses, tokenAddress)
      .send({
        from: this.hardlyWeb3.web3.defaultAccount
      });
  }
  //#endregion

  //#region Dev only (check)
  async getDev() {
    return this.contract.methods
      .dev()
      .call({ from: this.hardlyWeb3.web3.defaultAccount });
  }

  async developerSetFees(createFee, gasForEth, gasForErc20, gasForErc721) {
    await this._init();
    return await this.contract.methods
      .developerSetFees(createFee, gasForEth, gasForErc20, gasForErc721)
      .send({
        from: this.hardlyWeb3.web3.defaultAccount
      });
  }

  async devTransferAccount(newDevAccount) {
    await this._init();
    return await this.contract.methods
      .devTransferAccount(newDevAccount)
      .send({ from: this.hardlyWeb3.web3.defaultAccount });
  }

  async developerWithdrawFees() {
    await this._init();
    return await this.contract.methods.developerWithdrawFees().send({
      from: this.hardlyWeb3.web3.defaultAccount
    });
  }

  async getFeesCollected() {
    await this._init();
    return new BigNumber(
      await this.contract.methods.feesCollected().call({
        from: this.hardlyWeb3.web3.defaultAccount
      })
    );
  }
  //#endregion

  //#region Tx helpers
  async getRedeemTx(cardAddress) {
    if (!redeemCode) return;
    await this._init();
    const results = await this.contract.getPastEvents("Redeem", {
      filter: { cardAddress }, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0,
      toBlock: "latest"
    });
    if (results.length > 0) {
      const tx = results[results.length - 1];
      return tx;
    }
  }

  async getCardsICreated() {
    await this._init();
    const results = await this.contract.getPastEvents("CreateCard", {
      filter: { creator: this.hardlyWeb3.web3.defaultAccount }, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0,
      toBlock: "latest"
    });
    let cards = [];
    for (let i = 0; i < results.length; i++) {
      cards.push({
        tx: results[i].transactionHash,
        redeemCodeAddress: results[i].returnValues.redeemCode
      });
    }
    return cards;
  }

  async getCardMessages(cardAddress) {
    if (!redeemCode) return;
    await this._init();
    const results = await this.contract.getPastEvents("CreateCard", {
      filter: { cardAddress }, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0,
      toBlock: "latest"
    });
    if (results.length > 0) {
      const tx = results[results.length - 1].transactionHash;
      const request = await this.hardlyWeb3.web3.eth.getTransaction(tx);
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
      let i = new BigNumber(10 + 64 * 5);
      let cardCount = new BigNumber(request.input.substr(i.toNumber(), 64), 16);
      i = i.plus(cardCount.plus(1).times(64));
      let tokenAddressCount = new BigNumber(
        request.input.substr(i.toNumber(), 64),
        16
      );
      i = i.plus(tokenAddressCount.plus(1).times(64));
      let tokenValueCount = new BigNumber(
        request.input.substr(i.toNumber(), 64),
        16
      );
      i = i.plus(tokenValueCount.plus(1).times(64));
      let descriptionLength = new BigNumber(
        request.input.substr(i.toNumber(), 64),
        16
      );
      i = i.plus(64);
      let description = request.input.substr(
        i.toNumber(),
        descriptionLength * 2
      );
      i = i.plus(
        descriptionLength
          .plus(63)
          .div(64)
          .integerValue()
          .times(64)
      );
      let redeemedMessageLength = new BigNumber(
        request.input.substr(i.toNumber(), 64),
        16
      );
      i = i.plus(64);
      let redeemedMessage = request.input.substr(
        i.toNumber(),
        redeemedMessageLength * 2
      );
      return {
        description: hex_to_ascii(description),
        redeemedMessage: hex_to_ascii(redeemedMessage)
      };
    }
  }
  //#endregion

  //#region Private helpers
  async _sign(account, redeemCodePrivateKey) {
    const sig = this.hardlyWeb3.web3.eth.accounts
      .privateKeyToAccount(redeemCodePrivateKey)
      .sign(
        this.hardlyWeb3.web3.utils.keccak256(
          this.contract.options.address + account.substring(2)
        )
      );
    return { v: sig.v, r: sig.r, s: sig.s };
  }

  async _getPrivateKey(redeemCode) {
    if (!redeemCode) return;
    await this._init();
    const code = this.contract.options.address + redeemCode;
    return this.hardlyWeb3.web3.utils.keccak256(code);
  }

  async _getAddressByPrivateKey(privateKey) {
    if (!privateKey) return;
    await this._init();
    return (await this.hardlyWeb3.web3.eth.accounts.privateKeyToAccount(
      privateKey
    )).address;
  }
  //#endregion
}

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

module.exports = ethgc;
