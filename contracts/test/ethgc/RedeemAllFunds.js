const init = require('./helpers/init')
const { tokens } = require('hardlydifficult-eth')

contract('RedeemAllFunds', accounts => {
  const cardCreator = accounts[0]
  let ethgc
  let dai
  let sai
  let cardAddress
  const redeemCode = 'abc123'

  before(async () => {
    ethgc = await init(accounts)

    dai = await tokens.dai.deploy(web3, accounts[2])
    await dai.mint(cardCreator, 420000, {from: accounts[2]})
    await dai.approve(await ethgc.getAddress(), -1, {from: cardCreator})
    sai = await tokens.dai.deploy(web3, accounts[2])
    await sai.mint(cardCreator, 420000, {from: accounts[2]})
    await sai.approve(await ethgc.getAddress(), -1, {from: cardCreator})
    const chai = await tokens.dai.deploy(web3, accounts[2])
    await chai.mint(cardCreator, 420000, {from: accounts[2]})
    await chai.approve(await ethgc.getAddress(), -1, {from: cardCreator})

    cardAddress = await ethgc.getCardAddress(redeemCode)
    const otherCardAddress = await ethgc.getCardAddress('different code')
    console.log('create')
    //await ethgc.create([otherCardAddress], [token.address], [42])
    await ethgc.create([cardAddress], [dai.address, sai.address, chai.address], [42, 42, 42])
    console.log('create worked')
  })

  it('cardAddress has ETH for redeeming', async () => {
    const ethValue = await web3.eth.getBalance(cardAddress)
    assert.notEqual(ethValue, 0)
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
