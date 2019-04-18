const BigNumber = require("bignumber.js");
const EthGcNetwork = require("./ethGcNetwork");
const Web3 = require("web3");

class EthGc {
  constructor(currentProvider) {
    this.networks = [
      {
        name: "ropsten",
        ethGc: new EthGcNetwork(
          new Web3.providers.WebsocketProvider(
            "wss://ropsten.infura.io/ws/v3/1830f67bb051457b8d891301de981bd2"
          )
        )
      },
      {
        name: "kovan",
        ethGc: new EthGcNetwork(
          new Web3.providers.WebsocketProvider(
            "wss://kovan.infura.io/ws/v3/1830f67bb051457b8d891301de981bd2"
          )
        )
      },
      {
        name: "rinkeby",
        ethGc: new EthGcNetwork(
          new Web3.providers.WebsocketProvider(
            "wss://rinkeby.infura.io/ws/v3/1830f67bb051457b8d891301de981bd2"
          )
        )
      }
    ];
    if (currentProvider) {
      this.defaultWallet = new EthGcNetwork(currentProvider);
    } else {
      this.defaultWallet = this.networks[0].ethGc;
    }
  }

  // #region Create / Contribute
  async create(
    cardAddresses,
    tokenAddresses,
    valueOrIds,
    description = "",
    redeemedMessage = ""
  ) {
    return this.defaultWallet.create(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      description,
      redeemedMessage
    );
  }

  async calcEthRequired(cardAddresses, tokenAddresses, valueOrIds, isNewCard) {
    return this.defaultWallet.calcEthRequired(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      isNewCard
    );
  }

  async contribute(cardAddresses, tokenAddresses, valueOrIds) {
    return this.defaultWallet.contribute(
      cardAddresses,
      tokenAddresses,
      valueOrIds
    );
  }

  async getFeeRates() {
    return this.defaultWallet.getFeeRates();
  }

  async getFees(cardAddresses, tokenAddresses, valueOrIds, isNewCard) {
    return this.defaultWallet.getFees(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      isNewCard
    );
  }
  // #endregion

  // #region Viewing cards
  async getCardAddress(redeemCode) {
    const address = this.defaultWallet.getCardAddress(redeemCode);
    return address;
  }

  async getCard(cardAddress) {
    return this.checkAll("getCard", cardAddress);
  }
  // #endregion

  // #region Redeem cards
  async redeem(
    redeemCode,
    sendTo = this.hardlyWeb3.defaultAccount(),
    tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    return this.checkAll("redeem", redeemCode, sendTo, tokenType);
  }

  async redeemWithSignature(
    redeemCodes,
    tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    return this.checkAll("redeemWithSignature", redeemCodes, tokenType);
  }

  async cancel(
    cardAddresses,
    tokenType = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  ) {
    return this.checkAll("cancel", cardAddresses, tokenType);
  }
  // #endregion

  // #region Dev only (check)
  async getDev() {
    return this.defaultWallet.getDev();
  }

  async devSetFees(createFee, gasForEth, gasForErc20, gasForErc721) {
    return this.defaultWallet.devSetFees(
      createFee,
      gasForEth,
      gasForErc20,
      gasForErc721
    );
  }

  async devTransferAccount(newDevAccount) {
    return this.defaultWallet.devTransferAccount(newDevAccount);
  }

  async developerWithdrawFees() {
    return this.defaultWallet.developerWithdrawFees();
  }

  async getFeesCollected() {
    return this.defaultWallet.getFeesCollected();
  }
  // #endregion

  // #region Tx helpers
  async getRedeemTx(cardAddress) {
    return this.checkAll("getRedeemTx", cardAddress);
  }

  async getCardsICreated() {
    return this.defaultWallet.getCardsICreated();
  }

  async getCardMessages(cardAddress) {
    return this.checkAll("getCardMessages", cardAddress);
  }

  async checkAll(method, a, b, c, d, e) {
    try {
      let result = await this.networks[0].ethGc[method](a, b, c, d, e);
      if (result) {
        return result;
      }
    } catch (e) {}

    return new Promise(async resolve => {
      const promises = [];
      let wasResolved = false;
      for (let i = 1; i < this.networks.length; i++) {
        promises.push(
          (async () => {
            try {
              let networkResult = await this.networks[i].ethGc[method](
                a,
                b,
                c,
                d,
                e
              );
              if (networkResult) {
                if (!wasResolved) {
                  resolve(networkResult);
                  wasResolved = true;
                }
              }
            } catch (e) {}
          })()
        );
      }
      Promise.all(promises)
        .then(() => {
          if (!wasResolved) {
            resolve(undefined);
          }
        })
        .catch(console.error);
    });
  }
  // #endregion

  // #region Web3 wrapper
  toWei(value, unit = "ether") {
    return this.defaultWallet.hardlyWeb3.toWei(value, unit);
  }

  fromWei(value, unit = "ether") {
    return this.defaultWallet.hardlyWeb3.fromWei(value, unit);
  }

  getEthBalance(account) {
    return this.defaultWallet.hardlyWeb3.getEthBalance(account);
  }
  // #endregion
}

module.exports = EthGc;
