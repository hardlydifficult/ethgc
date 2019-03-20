pragma solidity ^0.5.6;


contract MixinSharedData
{
  struct Token
  {
    address tokenAddress;
    uint valueOrId;
  }

  struct Card
  {
    address createdBy;
    uint tokenCount;
    mapping(uint => Token) indexToToken;
  }

  mapping(address => Card) public addressToCard;

  /**
   * A small fee for the developer, charged in ETH when a card is created.
   */
  uint public costToCreateCard;

  /**
   * A sum of the fees collected for the developer since the last withdrawal.
   */
  uint public feesCollected;
}