const init = require('./helpers/init')
const { tokens } = require('hardlydifficult-ethereum-contracts')

contract.skip('RedeemAllFunds', accounts => {
  const cardCreator = accounts[0]
  let ethgc
  let token
  const redeemCode = 'abc123'

  before(async () => {
    ethgc = await init(accounts)

    token = await tokens.dai.deploy(web3, accounts[2])
    await token.mint(cardCreator, 42, {from: accounts[2]})
    await token.approve(await ethgc.getAddress(), -1, {from: cardCreator})

    const cardAddress = await ethgc.getCardAddress(redeemCode)
    await ethgc.create([cardAddress], [token.address], [42])
  })

  it('ethgc has zero eth', async () => {
    const ethValue = await web3.eth.getBalance(await ethgc.getAddress())
    assert.equal(ethValue, 0)
  })

  describe('after redeem', async () => {
    before(async () => {
      await ethgc.redeem(redeemCode)
    })

    it('ethgc has zero eth', async () => {
      const ethValue = await web3.eth.getBalance(await ethgc.getAddress())
      assert.equal(ethValue, 0)
    })
  })
})
