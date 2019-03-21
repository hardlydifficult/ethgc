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

  mapping(address => Card) internal addressToCard;

  /**
   * A small fee for the developer, charged in ETH when a card is created.
   */
  uint public costToCreateCard;

  /**
   * A sum of the fees collected for the developer since the last withdrawal.
   */
  uint public feesCollected;

  function getCard(
    address cardAddress
  ) external view
    returns (address createdBy, address[] memory tokenAddresses, uint[] memory valueOrIds)
  {
    Card storage card = addressToCard[cardAddress];
    createdBy = card.createdBy;
    tokenAddresses = new address[](card.tokenCount);
    valueOrIds = new uint[](card.tokenCount);
    for(uint i = 0; i < card.tokenCount; i++)
    {
      Token storage token = card.indexToToken[i];
      tokenAddresses[i] = token.tokenAddress;
      valueOrIds[i] = token.valueOrId;
    }
  }
}