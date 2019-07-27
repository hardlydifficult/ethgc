const fs = require('fs')
const HardlyWeb3 = require('./hardlyWeb3.js')
const Networks = require('./networks')

// TODO move to env variable
const privateKey =
  '0x2bbe937985021fdd8365af80bb37cf948bdd5eb71c38fe91f5e1901632442058'

module.exports.deploy = async (
  fromAccount = undefined,
  networkNodes = [
    Networks.ropsten.provider,
    Networks.kovan.provider,
    Networks.rinkeby.provider
  ]
) => {
  const ethgc = await deployContract(networkNodes, 'Ethgc', undefined, {
    from: fromAccount
  })
  await deployContract(networkNodes, 'EthgcExt', ethgc, {
    from: fromAccount
  })
}

async function deployContract(
  networkNodes,
  contractName,
  ethgcJson,
  txOptions
) {
  const fileBuildJson = `${__dirname}/../../contracts/build/contracts/${contractName}.json`
  const dirArtifacts = `${__dirname}/../../artifacts/`
  const fileArtifactsJson = `${dirArtifacts}${contractName}.json`
  let buildJson = JSON.parse(fs.readFileSync(fileBuildJson).toString())

  const hardlyWeb3 = new HardlyWeb3(networkNodes[0]) // TODO remove
  let artifactsJson

  try {
    artifactsJson = JSON.parse(fs.readFileSync(fileArtifactsJson).toString())
  } catch (e) {
    // ignore
  }
  if (!artifactsJson) {
    artifactsJson = {}
  }
  artifactsJson.abi = buildJson.abi
  artifactsJson.bytecodeHash = hardlyWeb3.web3.utils.keccak256(
    buildJson.deployedBytecode.substring(
      0,
      buildJson.deployedBytecode.length - 64
    )
  )
  await Promise.all(
    networkNodes.map(async networkNode => {
      const networkWeb3 = new HardlyWeb3(networkNode)
      if (txOptions.from) {
        networkWeb3.switchAccount(txOptions.from)
      }
      let networkBytecodeHash
      const networkId = await networkWeb3.web3.eth.net.getId()
      try {
        if (artifactsJson[networkId]) {
          const networkBytecode = await networkWeb3.web3.eth.getCode(
            artifactsJson[networkId]
          )
          networkBytecodeHash = networkWeb3.web3.utils.keccak256(
            networkBytecode
          )
        }
      } catch (e) {
        // ignore
      }

      if (
        artifactsJson.bytecodeHash === undefined ||
        networkBytecodeHash !== artifactsJson.bytecodeHash
      ) {
        // Deploy to this network
        const contract = new networkWeb3.web3.eth.Contract(buildJson.abi)
        const tx = await networkWeb3.send(
          contract.deploy({
            data:      buildJson.bytecode,
            arguments: ethgcJson ? [ethgcJson[networkId]] : []
          }),
          0,
          txOptions.from ? undefined : privateKey,
          4200000
        )
        const receipt = await networkWeb3.getReceipt(tx)
        artifactsJson[networkId] = receipt.contractAddress
      }

      if (networkWeb3.web3.currentProvider.connection) {
        networkWeb3.web3.currentProvider.connection.close()
      }
    })
  )
  fs.mkdirSync(dirArtifacts, { recursive: true })
  fs.writeFileSync(fileArtifactsJson, JSON.stringify(artifactsJson, null, 2))

  if (hardlyWeb3.web3.currentProvider.connection) {
    hardlyWeb3.web3.currentProvider.connection.close()
  }

  return artifactsJson
}
