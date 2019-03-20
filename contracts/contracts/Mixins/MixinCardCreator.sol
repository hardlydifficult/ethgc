pragma solidity ^0.5.6;

import "./MixinSharedData.sol";
import "./MixinRedeemCard.sol";


contract MixinCardCreator is
  MixinSharedData,
  MixinRedeemCard
{
  /**
   * Allows the creator of a card to get the money back, even if they do not remember 
   * the redeemCode itself. You can get a list of cards you created from event logs.
   *
   * Presumably the creator already knows the redemption codes. There's no way to 
   * trust that they do not. So a feature like this is nothing more than convenience.
   * e.g. if you distribute a paper card and it is lost
   */
  function cancelCards(
    address[] calldata redeemCodes
  ) external
  {
    uint length = redeemCodes.length;
    for(uint i = 0; i < length; i++)
    {
      if(redeemCodeAddressToCard[redeemCodes[i]].createdBy == msg.sender)
      {
        _sendGift(redeemCodes[i]);
      }
    }
  }
}
