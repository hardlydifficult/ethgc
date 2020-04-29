const init = require('./helpers/init')

contract('EthgcExt', accounts => {
  let ethgc, ethgcExt

  before(async () => {
    [ethgc, ethgcExt] = await init(accounts)
  })

  it('todo', async () => {
    assert.notEqual(ethgc, undefined)
    assert.notEqual(ethgcExt, undefined)
  })
})
