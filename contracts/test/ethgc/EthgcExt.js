const init = require('./helpers/init')

contract('EthgcExt', accounts => {

  before(async () => {
    const [ethgc, ethgcExt] = await init(accounts)
  })
})
