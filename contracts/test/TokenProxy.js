const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const MockTokenProxy = artifacts.require('MockTokenProxy')
const TestErc20 = artifacts.require('TestErc20')
const TestErc20Pausable = artifacts.require('TestErc20Pausable')
const TestNoop = artifacts.require('TestNoop')
const TestErc20Noop = artifacts.require('TestErc20Noop')

contract('TokenProxy', (accounts) => {
  const defaultQuantity = 1000000;
  const transferQuantity = 42
  let mockTokenProxy, testErc20, testErc20Pausable, testNoop, testErc20Noop
  let accountTokenHolder = accounts[1]
  let accountApproved = accounts[2]
  let accountApprovedHolder = accounts[3]
  let accountReceipient = accounts[4]

  before(async () => {
    mockTokenProxy = await MockTokenProxy.new()
    testErc20 = await TestErc20.new()
    testErc20Pausable = await TestErc20Pausable.new()
    testNoop = await TestNoop.new()
    testErc20Noop = await TestErc20Noop.new()
    await testErc20.mint(accountTokenHolder, defaultQuantity)
    await testErc20.mint(accountApprovedHolder, defaultQuantity)
    await testErc20Pausable.mint(accountTokenHolder, defaultQuantity)
    await testErc20Pausable.mint(accountApprovedHolder, defaultQuantity)
    await testErc20Noop.mint(accountTokenHolder, defaultQuantity)
    await testErc20Noop.mint(accountApprovedHolder, defaultQuantity)

    await testErc20.approve(
      mockTokenProxy.address, -1,
      { from: accountApproved }
    )
    await testErc20.approve(
      mockTokenProxy.address, -1,
      { from: accountApprovedHolder }
    )
    await testErc20Pausable.approve(
      mockTokenProxy.address, -1,
      { from: accountApproved }
    )
    await testErc20Pausable.approve(
      mockTokenProxy.address, -1,
      { from: accountApprovedHolder }
    )
    await testErc20Noop.approve(
      mockTokenProxy.address, -1,
      { from: accountApproved }
    )
    await testErc20Noop.approve(
      mockTokenProxy.address, -1,
      { from: accountApprovedHolder }
    )
  })

  describe('happy case', () => {
    let erc20BalanceBefore, erc20PausableBalanceBefore

    before(async () => {
      erc20BalanceBefore = new BigNumber(
        await testErc20.balanceOf(accountApprovedHolder)
      )
      erc20PausableBalanceBefore = new BigNumber(
        await testErc20Pausable.balanceOf(accountApprovedHolder)
      )
    })
    
    it('Can transfer erc20', async () => {
      await mockTokenProxy.transferToken(
        testErc20.address,
        transferQuantity,
        accountApprovedHolder,
        accountReceipient,
        {
          from: accountApprovedHolder
        }
      )
    })
    
    it('Can transfer erc20Pausable', async () => {
      await mockTokenProxy.transferToken(
        testErc20Pausable.address,
        transferQuantity,
        accountApprovedHolder,
        accountReceipient,
        {
          from: accountApprovedHolder
        }
      )
    })

    it('remove the right amount from the sender', async () => {
      const erc20Balance = new BigNumber(
        await testErc20.balanceOf(accountApprovedHolder)
      )
      const erc20PausableBalance = new BigNumber(
        await testErc20Pausable.balanceOf(accountApprovedHolder)
      )
      assert.equal(
        erc20Balance.toFixed(),
        erc20BalanceBefore.minus(transferQuantity).toFixed()
      )
      assert.equal(
        erc20PausableBalance.toFixed(),
        erc20PausableBalanceBefore.minus(transferQuantity).toFixed()
      )
    })

    it('added the right amount to the receiver', async () => {
      const erc20Balance = new BigNumber(
        await testErc20.balanceOf(accountReceipient)
      )
      const erc20PausableBalance = new BigNumber(
        await testErc20Pausable.balanceOf(accountReceipient)
      )
      assert.equal(
        erc20Balance.toFixed(),
        transferQuantity
      )
      assert.equal(
        erc20PausableBalance.toFixed(),
        transferQuantity
      )
    })
    
    it('The from account for this mock does not matter', async () => {
      await mockTokenProxy.transferToken(
        testErc20.address,
        transferQuantity,
        accountApprovedHolder,
        accountReceipient,
        {
          from: accounts[8]
        }
      )
    })
  })
    
  describe('error conditions', () => {
    it('transfer reverts if the balance does not update', async () => {
      await shouldFail(mockTokenProxy.transferToken(
        testErc20Noop.address,
        transferQuantity,
        accountApprovedHolder,
        accountReceipient
      ), 'TRANSFER_FAILED')
    })

    it('not approved', async () => {
      await shouldFail(mockTokenProxy.transferToken(
        testErc20.address,
        1,
        accountTokenHolder,
        accountReceipient
      ))
    })

    it('approved but no balance', async () => {
      await shouldFail(mockTokenProxy.transferToken(
        testErc20.address,
        1,
        accountApproved,
        accountReceipient
      ))
    })

    it('token address(0)', async () => {
      await shouldFail(mockTokenProxy.transferToken(
        web3.utils.padLeft(0, 40),
        1,
        accountApprovedHolder,
        accountReceipient
      ))
    })

    it('paused erc20', async () => {
      await testErc20Pausable.pause()
      await shouldFail(mockTokenProxy.transferToken(
        testErc20Pausable.address,
        1,
        accountApprovedHolder,
        accountReceipient
      ))
      await testErc20Pausable.unpause()
    })

    it('contract which is not a token', async () => {
      await shouldFail(mockTokenProxy.transferToken(
        testNoop.address,
        1,
        accountApprovedHolder,
        accountReceipient
      ))
    })
  })
})
