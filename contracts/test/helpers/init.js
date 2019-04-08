const deploy = require("../../../library/deploy.js");
const ethgcJs = require("../../../library/ethgc.js");

module.exports = async function init(accounts) {
  await deploy.deploy(accounts[0], [web3.currentProvider]);
  const ethgc = new ethgcJs(web3.currentProvider);
  ethgc.hardlyWeb3.switchAccount(accounts[0]);
  return ethgc;
};
