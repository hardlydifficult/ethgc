const fs = require("fs");
const HardlyWeb3 = require("./hardlyWeb3.js");
const ETHGC_JSON = `${__dirname}/artifacts/ethgc.json`;

// TODO move to env variable
const privateKey =
  "0x2bbe937985021fdd8365af80bb37cf948bdd5eb71c38fe91f5e1901632442058";

module.exports.deploy = async (
  fromAccount = undefined,
  networkNodes = ["https://127.0.0.1:8545", "rinkeby.infura.io/v3/1830f67bb051457b8d891301de981bd2"]
) => {
  const hardlyWeb3 = new HardlyWeb3(networkNodes[0]);
  const ethgc = JSON.parse(
    fs
      .readFileSync(`${__dirname}/../contracts/build/contracts/ethgc.json`)
      .toString()
  );
  let json;

  try {
    json = JSON.parse(fs.readFileSync(ETHGC_JSON).toString());
  } catch (e) {
    // ignore
  }
  if (!json) {
    json = {};
  }
  json.abi = ethgc.abi;
  json.bytecodeHash = hardlyWeb3.web3.utils.keccak256(ethgc.deployedBytecode);
  for (let i = 0; i < networkNodes.length; i++) {
    const networkNode = networkNodes[i];

    const networkWeb3 = new HardlyWeb3(networkNode);
    if (fromAccount) {
      networkWeb3.switchAccount(fromAccount);
    }
    const networkId = await networkWeb3.web3.eth.net.getId();
    let networkBytecodeHash;
    if (json[networkId]) {
      const networkBytecode = await networkWeb3.web3.eth.getCode(
        json[networkId]
      );
      networkBytecodeHash = networkWeb3.web3.utils.keccak256(networkBytecode);
    }
    if (networkBytecodeHash !== json.bytecodeHash) {
      // Deploy to this network
      const contract = new networkWeb3.web3.eth.Contract(json.abi);
      console.log("try deploy from " + networkWeb3.defaultAccount());
      const tx = await networkWeb3.send(
        contract.deploy({ data: ethgc.bytecode }), // todo byte or deployed?
        0,
        fromAccount ? undefined : privateKey,
        4200000
      );
      const receipt = await networkWeb3.getReceipt(tx);
      json[networkId] = receipt.contractAddress;
    }
  }

  json = JSON.stringify(json, null, 2);
  fs.writeFileSync(ETHGC_JSON, json);

  console.log("Contracts deployed");
};
