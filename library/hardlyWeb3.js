const Web3 = require("web3");
const BigNumber = require("bignumber.js");

class HardlyWeb3 {
  constructor(currentProvider, defaultAccount) {
    this.web3 = new Web3(currentProvider);
    this.web3.defaultGasPrice = 4000000000;
    this.switchAccount(defaultAccount);
  }

  async getEthBalance(account = this.web3.defaultAccount) {
    return new BigNumber(await this.web3.eth.getBalance(account));
  }

  async getRequest(tx) {
    if (tx.request) return tx.request;

    const request = await this.web3.eth.getTransaction(tx.hash);
    return (tx.request = request);
  }

  async getReceipt(tx) {
    if (tx.receipt) return tx.receipt;

    const receipt = await this.web3.eth.getTransactionReceipt(tx.hash);
    return (tx.receipt = receipt);
  }

  async getGasCost(tx) {
    return getGasCost(await this.getRequest(tx), await this.getReceipt(tx));
  }

  /*********************************************************************************
   * Helpers (non-network requests)
   */

  switchAccount(account) {
    this.web3.defaultAccount = this.web3.utils.toChecksumAddress(account);
  }

  fromWei(value, unit = "ether") {
    if (typeof value === "number") value = value.toString();
    return this.web3.utils.fromWei(value, unit);
  }

  toWei(value, unit = "ether") {
    if (typeof value === "number") value = value.toString();
    return this.web3.utils.toWei(value, unit);
  }
}

/*********************************************************************************
 * Private Helpers (non-network requests)
 */

function getGasCost(txRequest, txReceipt) {
  return new BigNumber(txRequest.gasPrice).times(txReceipt.gasUsed);
}

module.exports = HardlyWeb3;
