const deploy = require("../../../../library/src/deploy");
const EthGc = require("../../../../library/src/ethgc/ethGcNetwork");

module.exports = async function init(accounts) {
  await deploy.deploy(accounts[0], [web3.currentProvider]);
  const ethGc = new EthGc(web3.currentProvider);
  ethGc.hardlyWeb3.switchAccount(accounts[0]);
  return ethGc;
};
