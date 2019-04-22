const fs = require("fs");
const HardlyWeb3 = require("./hardlyWeb3.js");
const Networks = require("./networks");

// TODO move to env variable
const privateKey =
  "0x2bbe937985021fdd8365af80bb37cf948bdd5eb71c38fe91f5e1901632442058";

module.exports.deploy = async (
  fromAccount = undefined,
  networkNodes = [
    Networks.ropsten.provider,
    Networks.kovan.provider,
    Networks.rinkeby.provider
  ]
) => {
  const ethgc = await deployContract(networkNodes, "Ethgc", [], {
    from: fromAccount
  });
  await deployContract(networkNodes, "EthgcExt", [ethgc.address], {
    from: fromAccount
  });
};

async function deployContract(
  networkNodes,
  contractName,
  deployParameters,
  txOptions
) {
  const fileBuildJson = `${__dirname}/../../contracts/build/contracts/${contractName}.json`;
  const dirArtifacts = `${__dirname}/../artifacts/`;
  const fileArtifactsJson = `${dirArtifacts}${contractName}.json`;
  const buildJson = JSON.parse(fs.readFileSync(fileBuildJson).toString());

  const hardlyWeb3 = new HardlyWeb3(networkNodes[0]); // TODO remove
  let artifactsJson;

  try {
    artifactsJson = JSON.parse(fs.readFileSync(fileArtifactsJson).toString());
  } catch (e) {
    // ignore
  }
  if (!artifactsJson) {
    artifactsJson = {};
  }
  artifactsJson.abi = buildJson.abi;
  artifactsJson.bytecodeHash = hardlyWeb3.web3.utils.keccak256(
    buildJson.deployedBytecode
  );
  for (let i = 0; i < networkNodes.length; i++) {
    const networkNode = networkNodes[i];

    const networkWeb3 = new HardlyWeb3(networkNode);
    if (txOptions.from) {
      networkWeb3.switchAccount(txOptions.from);
    }
    const networkId = await networkWeb3.web3.eth.net.getId();
    let networkBytecodeHash;
    if (artifactsJson[networkId]) {
      const networkBytecode = await networkWeb3.web3.eth.getCode(
        artifactsJson[networkId]
      );
      networkBytecodeHash = networkWeb3.web3.utils.keccak256(networkBytecode);
    }

    if (networkBytecodeHash !== buildJson.bytecodeHash) {
      // Deploy to this network
      const contract = new networkWeb3.web3.eth.Contract(buildJson.abi);
      const tx = await networkWeb3.send(
        contract.deploy({
          data: buildJson.bytecode,
          arguments: deployParameters
        }),
        0,
        txOptions.from ? undefined : privateKey,
        4200000
      );
      const receipt = await networkWeb3.getReceipt(tx);
      artifactsJson[networkId] = receipt.contractAddress;
      console.log(`deployed ${receipt.contractAddress} on ${networkId}`);
    }
  }

  artifactsJson = JSON.stringify(artifactsJson, null, 2);
  await fs.promises.mkdir(dirArtifacts, { recursive: true });
  fs.writeFileSync(fileArtifactsJson, artifactsJson);
  return artifactsJson;
}
