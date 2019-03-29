const ETHGC = artifacts.require("ethgc");
const fs = require("fs");

module.exports = async function(deployer) {
  await deployer.deploy(ETHGC);
  fs.writeFile(
    `../library/abi/${await web3.eth.net.getId()}.json`,
    JSON.stringify(
      {
        abi: ETHGC.abi,
        address: ETHGC.address
      },
      null,
      2
    ),
    () => {}
  );
};
