pragma solidity ^0.5.6;

import "./MixinSharedData.sol";
import "./MixinRedeemCard.sol";


contract MixinCardCreator is
  MixinSharedData,
  MixinRedeemCard
{
  /**
   * Allows the creator of a card to get the money back, even if they do not remember 
   * the redeemCode.
   *
   * Presumably the creator already knows the redemption codes. There's no way to 
   * trust that they do not. So a feature like this is nothing more than convenience.
   * e.g. if you distribute a paper card and it is lost
   */
  function cancelCard(
    address redeemCode
  ) external
  {
    require(
      redeemCodeAddressToCard[redeemCode].createdBy == msg.sender,
      "NOT_YOUR_CARD"
    );
    _sendGift(redeemCode);
  }
}
