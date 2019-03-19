pragma solidity ^0.5.6;


contract MixinSharedData
{
  struct Card
  {
    address createdBy;
    address token;
    uint valueOrTokenId;
  }

  mapping(address => Card) public redeemCodeToCard;

  /**
   * A small fee for the developer, charged in ETH when a card is created.
   */
  uint public costToCreateCard;

  /**
   * A sum of the fees collected for the developer since the last withdrawal.
   */
  uint public feesCollected;
}