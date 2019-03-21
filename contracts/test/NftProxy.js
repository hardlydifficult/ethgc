const shouldFail = require('./helpers/shouldFail')
const BigNumber = require('bignumber.js')
const MockNftProxy = artifacts.require('MockNftProxy')
const TestErc721 = artifacts.require('TestErc721')
const TestErc721Pausable = artifacts.require('TestErc721Pausable')
const TestNoop = artifacts.require('TestNoop')
const TestErc721Noop = artifacts.require('TestErc721Noop')

contract('NftProxy', (accounts) => {
  let mockNftProxy, testErc721, testErc721Pausable, testNoop, testErc721Noop
  let accountNftHolder = accounts[1]
  let accountApproved = accounts[2]
  let accountApprovedHolder = accounts[3]
  let accountReceipient = accounts[4]

  before(async () => {
    mockNftProxy = await MockNftProxy.new()
    testErc721 = await TestErc721.new()
    testErc721Pausable = await TestErc721Pausable.new()
    testNoop = await TestNoop.new()
    testErc721Noop = await TestErc721Noop.new()
    await testErc721.mint(accountNftHolder, accountNftHolder)
    await testErc721.mint(accountApprovedHolder, accountApprovedHolder)
    await testErc721Pausable.mint(accountNftHolder, accountNftHolder)
    await testErc721Pausable.mint(accountApprovedHolder, accountApprovedHolder)
    await testErc721Noop.mint(accountNftHolder, accountNftHolder)
    await testErc721Noop.mint(accountApprovedHolder, accountApprovedHolder)
    await testErc721.setApprovalForAll(
      mockNftProxy.address, true,
      { from: accountApproved }
    )
    await testErc721.setApprovalForAll(
      mockNftProxy.address, true,
      { from: accountApprovedHolder }
    )
    await testErc721Pausable.setApprovalForAll(
      mockNftProxy.address, true,
      { from: accountApproved }
    )
    await testErc721Pausable.setApprovalForAll(
      mockNftProxy.address, true,
      { from: accountApprovedHolder }
    )
    await testErc721Noop.setApprovalForAll(
      mockNftProxy.address, true,
      { from: accountApproved }
    )
    await testErc721Noop.setApprovalForAll(
      mockNftProxy.address, true,
      { from: accountApprovedHolder }
    )
  })

  describe('isNFT', () => {
    it('isNft testErc721', async () => {
      assert.equal(await mockNftProxy.isNft(testErc721.address), true)
    })
    
    it('isNft testErc721Pausable', async () => {
      assert.equal(await mockNftProxy.isNft(testErc721Pausable.address), true)
    })
    
    it('isNft is false testErc721Noop', async () => {
      await shouldFail(
        mockNftProxy.isNft(testErc721Noop.address)
      )
    })
    
    it('isNft is false for testNoop', async () => {
      await shouldFail(
        mockNftProxy.isNft(testNoop.address)
      )
    })
  })

  describe('happy case', () => {
    let erc721BalanceBefore, erc721PausableBalanceBefore

    before(async () => {
      erc721BalanceBefore = new BigNumber(
        await testErc721.balanceOf(accountApprovedHolder)
      )
      erc721PausableBalanceBefore = new BigNumber(
        await testErc721Pausable.balanceOf(accountApprovedHolder)
      )
    })
    
    it('Can transfer Erc721', async () => {
      await shouldFail(mockNftProxy.transferNft(
        testErc721.address,
        accountApprovedHolder,
        accountApprovedHolder,
        accountReceipient,
        {
          from: accountApprovedHolder
        }
      ), 'TRANSFER_FAILED')

    })
    
    it('Can transfer Erc721Pausable', async () => {
      await mockNftProxy.transferNft(
        testErc721Pausable.address,
        accountApprovedHolder,
        accountApprovedHolder,
        accountReceipient,
        {
          from: accountApprovedHolder
        }
      )
    })

    it('remove the right amount from the sender', async () => {
      const erc721Balance = new BigNumber(
        await testErc721.balanceOf(accountApprovedHolder)
      )
      const erc721PausableBalance = new BigNumber(
        await testErc721Pausable.balanceOf(accountApprovedHolder)
      )
      assert.equal(
        erc721Balance.toFixed(),
        0
      )
      assert.equal(
        erc721PausableBalance.toFixed(),
        0
      )
    })

    it('added the right amount to the receiver', async () => {
      const erc721Balance = new BigNumber(
        await testErc721.balanceOf(accountReceipient)
      )
      const erc721PausableBalance = new BigNumber(
        await testErc721Pausable.balanceOf(accountReceipient)
      )
      assert.equal(
        erc721Balance.toFixed(),
        1
      )
      assert.equal(
        erc721PausableBalance.toFixed(),
        1
      )
    })
    
    it('The from account for this mock does not matter', async () => {
      await testErc721.setApprovalForAll(
        mockNftProxy.address, true,
        { from: accounts[5] }
      )
      await testErc721.mint(accounts[5], accounts[5])
      
      await mockNftProxy.transferNft(
        testErc721.address,
        accounts[5],
        accounts[5],
        accountReceipient,
        {
          from: accounts[8]
        }
      )
    })
  })
    
  describe('error conditions', () => {
    it('transfer reverts if the transfer fails', async () => {
      await shouldFail(mockNftProxy.transferNft(
        testErc721.address,
        accountNftHolder,
        accountApprovedHolder,
        accountReceipient
      ), 'NOT_YOUR_NFT')
    })

    it('returns false if the transfer fails', async () => {
      const result = await mockNftProxy.transferNft(
        testErc721Noop.address,
        accounts[7],
        accounts[7],
        accountReceipient
      )
      assert.equal(result, false)
    })

    it('not approved', async () => {
      await shouldFail(mockNftProxy.transferNft(
        testErc721.address,
        accountNftHolder,
        accountNftHolder,
        accountReceipient
      ))
    })

    it('approved but no balance', async () => {
      await shouldFail(mockNftProxy.transferNft(
        testErc721.address,
        accountApproved,
        accountApproved,
        accountReceipient
      ))
    })

    it('nft address(0)', async () => {
      await shouldFail(mockNftProxy.transferNft(
        web3.utils.padLeft(0, 40),
        accountApprovedHolder,
        accountApprovedHolder,
        accountReceipient
      ))
    })

    it('paused Erc721', async () => {
      await testErc721Pausable.pause()
      await shouldFail(mockNftProxy.transferNft(
        testErc721Pausable.address,
        accountApprovedHolder,
        accountApprovedHolder,
        accountReceipient
      ))
      await testErc721Pausable.unpause()
    })

    it('contract which is not a nft', async () => {
      await shouldFail(mockNftProxy.transferNft(
        testNoop.address,
        accountApprovedHolder,
        accountApprovedHolder,
        accountReceipient
      ))
    })
  })
})
