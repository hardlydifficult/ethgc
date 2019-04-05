const HardlyWeb3 = require("./hardlyWeb3.js");
const BigNumber = require("bignumber.js");

let _this;

class ethgc {
  //#region Init
  constructor(currentProvider) {
    this.hardlyWeb3 = new HardlyWeb3(currentProvider);
    _this = this;
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

  //#region Create / Contribute
  async create(
    cardAddresses,
    tokenAddresses,
    valueOrIds,
    description = "",
    redeemedMessage = ""
  ) {
    await this._init();
    parseInput(tokenAddresses, valueOrIds);
    let ethValue = await this.calcEthRequired(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      true
    );

    return send(
      this.contract.methods.create(
        cardAddresses,
        tokenAddresses,
        valueOrIds,
        description,
        redeemedMessage
      ),
      ethValue
    );
  }

  async calcEthRequired(cardAddresses, tokenAddresses, valueOrIds, isNewCard) {
    await this._init();
    parseInput(tokenAddresses, valueOrIds);
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
    parseInput(tokenAddresses, valueOrIds);
    let ethValue = await this.calcEthRequired(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      false
    );
    return send(
      this.contract.methods.contribute(
        cardAddresses,
        tokenAddresses,
        valueOrIds
      ),
      ethValue
    );
  }

  async getFeeRates() {
    await this._init();
    const [createFee, gasForEth, gasForErc20, gasForErc721] = await Promise.all(
      [
        this.contract.methods
          .createFee()
          .call({ from: this.hardlyWeb3.defaultAccount() }),
        this.contract.methods
          .gasForEth()
          .call({ from: this.hardlyWeb3.defaultAccount() }),
        this.contract.methods
          .gasForErc20()
          .call({ from: this.hardlyWeb3.defaultAccount() }),
        this.contract.methods
          .gasForErc721()
          .call({ from: this.hardlyWeb3.defaultAccount() })
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
    parseInput(tokenAddresses, valueOrIds);
    const {
      totalCreateFee,
      redemptionGas
    } = await this.contract.methods
      .getFees(cardAddresses, tokenAddresses, valueOrIds, isNewCard)
      .call({ from: this.hardlyWeb3.defaultAccount() });
    return {
      totalCreateFee: new BigNumber(totalCreateFee),
      redemptionGas: new BigNumber(redemptionGas)
    };
  }
  //#endregion

  //#region Viewing cards
  getCardAddress(redeemCode) {
    if (!redeemCode) return;
    return getAddressByPrivateKey(getPrivateKey(redeemCode));
  }

  async getCard(cardAddress) {
    if (!cardAddress) return;
    await this._init();
    const card = await this.contract.methods.getCard(cardAddress).call({
      from: this.hardlyWeb3.defaultAccount()
    });
    if (card.createdBy === this.hardlyWeb3.web3.utils.padLeft(0, 40)) {
      return undefined;
    }
    return card;
  }
  //#endregion

  //#region Redeem cards
  async redeem(
    redeemCode,
    sendTo = this.hardlyWeb3.defaultAccount(),
    tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    if (tokenType == -1) {
      tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
    }
    await this._init();
    const privateKey = await getPrivateKey(redeemCode);
    return send(this.contract.methods.redeem(sendTo, tokenType), 0, privateKey);
  }

  async redeemWithSignature(
    redeemCodes,
    tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    if (tokenType == -1) {
      tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
    }
    await this._init();
    const cardAddresses = [];
    const v = [];
    const r = [];
    const s = [];

    for (let i = 0; i < redeemCodes.length; i++) {
      const privateKey = await getPrivateKey(redeemCodes[i].redeemCode);
      cardAddresses.push(await getAddressByPrivateKey(privateKey));
      const sig = await sign(this.hardlyWeb3.defaultAccount(), privateKey);
      v.push(sig.v);
      r.push(sig.r);
      s.push(sig.s);
    }

    return send(
      this.contract.methods.redeemWithSignature(
        cardAddresses,
        v,
        r,
        s,
        tokenType
      )
    );
  }

  async cancel(
    cardAddresses,
    tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    await this._init();
    if (tokenType == -1) {
      tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
    }
    return send(this.contract.methods.cancel(cardAddresses, tokenType));
  }
  //#endregion

  //#region Dev only (check)
  async getDev() {
    return this.contract.methods
      .dev()
      .call({ from: this.hardlyWeb3.defaultAccount() });
  }

  async devSetFees(createFee, gasForEth, gasForErc20, gasForErc721) {
    await this._init();
    return send(
      this.contract.methods.devSetFees(
        createFee,
        gasForEth,
        gasForErc20,
        gasForErc721
      )
    );
  }

  async devTransferAccount(newDevAccount) {
    await this._init();
    return send(this.contract.methods.devTransferAccount(newDevAccount));
  }

  async developerWithdrawFees() {
    await this._init();
    return send(this.contract.methods.developerWithdrawFees());
  }

  async getFeesCollected() {
    await this._init();
    return new BigNumber(
      await this.contract.methods.feesCollected().call({
        from: this.hardlyWeb3.defaultAccount()
      })
    );
  }
  //#endregion

  //#region Tx helpers
  async getRedeemTx(cardAddress) {
    if (!cardAddress) return;
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
    const results = await this.contract.getPastEvents("Create", {
      filter: { creator: this.hardlyWeb3.defaultAccount() }, // Using an array means OR: e.g. 20 or 23
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
}

async function sign(account, redeemCodePrivateKey) {
  const sig = _this.hardlyWeb3.web3.eth.accounts
    .privateKeyToAccount(redeemCodePrivateKey)
    .sign(
      _this.hardlyWeb3.web3.utils.keccak256(
        _this.contract.options.address + account.substring(2)
      )
    );
  return { v: sig.v, r: sig.r, s: sig.s };
}

function getPrivateKey(redeemCode) {
  if (!redeemCode) return;
  const code = _this.contract.options.address + redeemCode;
  return _this.hardlyWeb3.web3.utils.keccak256(code);
}

function getAddressByPrivateKey(privateKey) {
  if (!privateKey) return;
  return _this.hardlyWeb3.web3.eth.accounts.privateKeyToAccount(privateKey)
    .address;
}

function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

async function setMaxGasPrice(sendOptions) {
  let balance = await _this.hardlyWeb3.getEthBalance(sendOptions.from);
  balance = balance.minus(sendOptions.value ? sendOptions.value : 0);

  sendOptions.gasPrice = new BigNumber(
    Math.min(
      parseInt(_this.hardlyWeb3.toWei("4", "gwei")),
      balance.div(sendOptions.gas).toNumber()
    )
  ).integerValue(BigNumber.ROUND_DOWN);
  if (sendOptions.gasPrice.lt(_this.hardlyWeb3.toWei("0.5", "gwei"))) {
    throw new Error(
      `The account does not have enough balance: gasPrice~ ${
        sendOptions.gasPrice
      }`
    );
  }

  // TODO change the gas and value if min kicks in.
  /// ... than add the remainder to the value... which is 0 for this use case.
}

function send(functionCall, ethValue = undefined, privateKey) {
  const sendOptions = {
    value: ethValue ? ethValue.toFixed() : undefined
  };

  return new Promise(async function(resolve, reject) {
    if (privateKey) {
      const account = _this.hardlyWeb3.web3.eth.accounts.privateKeyToAccount(
        privateKey
      );
      _this.hardlyWeb3.web3.eth.accounts.wallet.add(account);
      sendOptions.from = account.address;
    } else {
      sendOptions.from = _this.hardlyWeb3.defaultAccount();
    }

    sendOptions.gas = new BigNumber(
      await functionCall.estimateGas(sendOptions)
    ).plus(3000); // I'm not sure why this helps, but createCard consistently fails without it
    await setMaxGasPrice(sendOptions);

    functionCall
      .send(sendOptions)
      .on("transactionHash", tx => {
        resolve({ hash: tx });
      })
      .on("error", error => {
        reject(error);
      });
  });
}

function parseInput(tokenAddresses, valueOrIds) {
  for (let i = 0; i < tokenAddresses.length; i++) {
    if (!tokenAddresses[i] || tokenAddresses[i] == "0") {
      tokenAddresses[i] = _this.hardlyWeb3.web3.utils.padLeft(0, 40);
    }
  }

  for (let i = 0; i < valueOrIds.length; i++) {
    if (typeof valueOrIds[i] !== "string") {
      valueOrIds[i] = new BigNumber(valueOrIds[i]).toFixed();
    }
  }
}

module.exports = ethgc;
