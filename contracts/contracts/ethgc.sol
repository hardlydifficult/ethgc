pragma solidity ^0.5.6;

import "./Mixins/ReentrancyGuard.sol";
import "./Mixins/MixinBank.sol";
import "./Mixins/MixinCards.sol";
import "./Mixins/MixinContribute.sol";
import "./Mixins/MixinCreate.sol";
import "./Mixins/MixinDev.sol";
import "./Mixins/MixinFees.sol";
import "./Mixins/MixinRedeem.sol";


/**
  @title Ethereum Gift Cards (ethgc.com)
  @author HardlyDifficult

  @notice Give away ETH, tokens, or NFTs with a simple redeem code.
  @dev https://github.com/hardlydifficult/ethgc
 */
contract ethgc is
  ReentrancyGuard,
  MixinDev,
  MixinFees,
  MixinBank,
  MixinCards,
  MixinCreate,
  MixinContribute,
  MixinRedeem
{}