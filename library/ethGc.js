const BigNumber = require("bignumber.js");
const EthGcNetwork = require("./ethGcNetwork");
const Web3 = require("web3");

const networkNodes = [
  // todo mainnet
  "https://ropsten.infura.io/v3/1830f67bb051457b8d891301de981bd2",
  "https://kovan.infura.io/v3/1830f67bb051457b8d891301de981bd2",
  "https://rinkeby.infura.io/v3/1830f67bb051457b8d891301de981bd2"
];

class EthGc {
  constructor(currentProvider) {
    this.userWallet = new EthGcNetwork(currentProvider);
    this.networks = [
      {
        name: "ropsten",
        ethGc: new EthGcNetwork(
          new Web3.providers.HttpProvider(networkNodes[0])
        )
      },
      {
        name: "kovan",
        ethGc: new EthGcNetwork(
          new Web3.providers.HttpProvider(networkNodes[1])
        )
      },
      {
        name: "rinkeby",
        ethGc: new EthGcNetwork(
          new Web3.providers.HttpProvider(networkNodes[2])
        )
      }
    ];
  }

  // #region Create / Contribute
  async create(
    cardAddresses,
    tokenAddresses,
    valueOrIds,
    description = "",
    redeemedMessage = ""
  ) {
    return this.userWallet.create(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      description,
      redeemedMessage
    );
  }

  async calcEthRequired(cardAddresses, tokenAddresses, valueOrIds, isNewCard) {
    return this.userWallet.calcEthRequired(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      isNewCard
    );
  }

  async contribute(cardAddresses, tokenAddresses, valueOrIds) {
    return this.userWallet.contribute(
      cardAddresses,
      tokenAddresses,
      valueOrIds
    );
  }

  async getFeeRates() {
    return this.userWallet.getFeeRates();
  }

  async getFees(cardAddresses, tokenAddresses, valueOrIds, isNewCard) {
    return this.userWallet.getFees(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      isNewCard
    );
  }
  // #endregion

  // #region Viewing cards
  async getCardAddress(redeemCode) {
    return this.userWallet.getCardAddress(redeemCode);
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
    return this.userWallet.getDev();
  }

  async devSetFees(createFee, gasForEth, gasForErc20, gasForErc721) {
    return this.userWallet.devSetFees(
      createFee,
      gasForEth,
      gasForErc20,
      gasForErc721
    );
  }

  async devTransferAccount(newDevAccount) {
    return this.userWallet.devTransferAccount(newDevAccount);
  }

  async developerWithdrawFees() {
    return this.userWallet.developerWithdrawFees();
  }

  async getFeesCollected() {
    return this.userWallet.getFeesCollected();
  }
  // #endregion

  // #region Tx helpers
  async getRedeemTx(cardAddress) {
    return this.checkAll("getRedeemTx", cardAddress);
  }

  async getCardsICreated() {
    return this.userWallet.getCardsICreated();
  }

  async getCardMessages(cardAddress) {
    return this.checkAll("getCardMessages", cardAddress);
  }

  async checkAll(method, a, b, c, d, e) {
    let result = await this.networks[0].ethGc[method](a, b, c, d, e);
    if (result) {
      return result;
    }

    return new Promise(async resolve => {
      const promises = [];
      let wasResolved = false;
      for (let i = 1; i < this.networks.length; i++) {
        promises.push(
          (async () => {
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
    return this.userWallet.hardlyWeb3.toWei(value, unit);
  }

  fromWei(value, unit = "ether") {
    return this.userWallet.hardlyWeb3.fromWei(value, unit);
  }

  getEthBalance(account) {
    return this.userWallet.hardlyWeb3.getEthBalance(account);
  }
  // #endregion
}

module.exports = EthGc;
