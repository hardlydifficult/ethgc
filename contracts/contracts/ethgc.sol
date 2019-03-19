pragma solidity ^0.5.6;

import "./Mixins/MixinCreateCard.sol";
import "./Mixins/MixinCardCreator.sol";
import "./Mixins/MixinFees.sol";
import "./Mixins/MixinNftProxy.sol";
import "./Mixins/MixinRedeemCard.sol";
import "./Mixins/MixinSharedData.sol";
import "./Mixins/MixinTokenProxy.sol";


/**
 * Ethereum Gift Cards
 * ethgc.com
 * 
 * Give away ETH, tokens, or NFTs using a redeem code.
 * https://github.com/hardlydifficult/ethgc
 */
contract ethgc is
  MixinTokenProxy,
  MixinNftProxy,
  MixinSharedData,
  MixinFees,
  MixinCreateCard,
  MixinRedeemCard,
  MixinCardCreator
{}