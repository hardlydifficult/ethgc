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
   * @param tokenAddress 0 == ETH, value == ERC20/ERC721, max == send all
   *
   * Presumably the creator already knows the redemption codes. There's no way to 
   * trust that they do not. So a feature like this is nothing more than convenience.
   * e.g. if you distribute a paper card and it is lost
   */
  function cancelCards(
    address[] calldata redeemCodes,
    address tokenAddress
  ) external
  {
    uint length = redeemCodes.length;
    for(uint i = 0; i < length; i++)
    {
      if(addressToCard[redeemCodes[i]].createdBy == msg.sender)
      {
        _sendGift(redeemCodes[i], tokenAddress);
      }
    }
  }
}
