const fs = require("fs");
const HardlyWeb3 = require("./hardlyWeb3.js");
const ETHGC_JSON = "./artifacts/ethgc.json";
const networkNodes = ["https://127.0.0.1:7545"];
// TODO move to env variable
const privateKey =
  "2bbe937985021fdd8365af80bb37cf948bdd5eb71c38fe91f5e1901632442058";

module.exports.deploy = async () => {
  const hardlyWeb3 = new HardlyWeb3(networkNodes[0]);
  const ethgc = JSON.parse(
    fs.readFileSync("./build/contracts/ethgc.json").toString()
  );
  let json;

  // todo git pull contracts from contracts branch

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
    const networkWeb3 = new HardlyWeb3(
      new hardlyWeb3.providers.WebsocketProvider(networkNode)
    );
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
      const contract = new networkWeb3.eth.Contract(json.abi);
      const tx = await contract.deploy({ data: ethgc.deployedBytecode }).send();
      console.log(tx);
    }
  }

  json = JSON.stringify(json, null, 2);
  fs.writeFileSync(ETHGC_JSON, json);

  // todo git commit and push contracts from contracts branch

  console.log("Contracts deployed");
  process.exit();
};
