const Web3 = require("web3");
const BigNumber = require("bignumber.js");

class HardlyWeb3 {
  constructor(currentProvider) {
    if (!currentProvider) {
      throw new Error("Missing provider");
    } else if (typeof currentProvider === "string") {
      currentProvider = new Web3.providers.WebsocketProvider(currentProvider);
    }
    this.web3 = new Web3(currentProvider);
    this.web3.defaultGasPrice = 4000000000;
  }

  async getEthBalance(account = this.defaultAccount()) {
    return new BigNumber(await this.web3.eth.getBalance(account));
  }

  async getRequest(tx) {
    if (tx.request) return tx.request;

    const request = await this.web3.eth.getTransaction(tx.hash);
    return (tx.request = request);
  }

  async getReceipt(tx) {
    if (tx.receipt) return tx.receipt;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const receipt = await this.web3.eth.getTransactionReceipt(tx.hash);
      if (receipt) return (tx.receipt = receipt);
      await sleep(2000);
    }
  }

  async getGasCost(tx) {
    return getGasCost(await this.getRequest(tx), await this.getReceipt(tx));
  }

  async send(functionCall, ethValue = undefined, privateKey, fixedGas) {
    const sendOptions = {
      value: ethValue ? ethValue.toFixed() : undefined
    };

    return new Promise(async (resolve, reject) => {
      if (privateKey) {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.web3.eth.accounts.wallet.add(account);
        sendOptions.from = account.address;
      } else {
        sendOptions.from = this.defaultAccount();
      }

      if (fixedGas) {
        sendOptions.gas = fixedGas;
      } else {
        sendOptions.gas = new BigNumber(
          await functionCall.estimateGas(sendOptions)
        ).plus(3000); // I'm not sure why this helps, but createCard consistently fails without it
        await this.setMaxGasPrice(sendOptions);
      }

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

  defaultAccount() {
    const account =
      this.web3.currentProvider.selectedAddress || this.web3.defaultAccount;
    return account;
  }

  async setMaxGasPrice(sendOptions) {
    let balance = await this.getEthBalance(sendOptions.from);
    balance = balance.minus(sendOptions.value ? sendOptions.value : 0);

    sendOptions.gasPrice = balance
      .div(sendOptions.gas)
      .integerValue(BigNumber.ROUND_DOWN);
    sendOptions.gasPrice = new BigNumber(
      Math.min(
        parseInt(this.toWei("4", "gwei")),
        sendOptions.gasPrice.toNumber()
      )
    );
    if (sendOptions.gasPrice.lt(this.toWei("0.5", "gwei"))) {
      throw new Error(
        `The account does not have enough balance: gasPrice~ ${
          sendOptions.gasPrice
        }`
      );
    }

    // TODO change the gas and value if min kicks in.
    /// ... than add the remainder to the value... which is 0 for this use case.
  }
}

/*********************************************************************************
 * Private Helpers (non-network requests)
 */

function getGasCost(txRequest, txReceipt) {
  return new BigNumber(txRequest.gasPrice).times(txReceipt.gasUsed);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = HardlyWeb3;
