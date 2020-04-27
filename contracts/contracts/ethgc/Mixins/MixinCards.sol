pragma solidity ^0.6.0;

import "../interfaces/ICard.sol";

contract MixinCards is
  ICard
{
  mapping(address => Card) internal addressToCard;

  /**
    Gets information about a card.

    @param cardAddress The address generated from the redeem code using:
    Private key = `keccak256(encodePacked(address(this), redeemCode))`
    @return createdBy the address of the account that created and funded the card.
    @return tokenAddresses and valueOrIds will be arrays of the same length.
    address(0) represents ETH, otherwise it's the contract address for an ERC20 or
    ERC721.
    @return valueOrIds the number of tokens included for ETH or ERC20, the tokenId for ERC721
   */
  function getCard(
    address cardAddress
  ) external view
    returns (
      address createdBy,
      address[] memory tokenAddresses,
      uint[] memory valueOrIds
    )
  {
    Card storage card = addressToCard[cardAddress];
    createdBy = card.createdBy;
    uint tokenCount = card.tokens.length;
    tokenAddresses = new address[](tokenCount);
    valueOrIds = new uint[](tokenCount);
    for(uint i = 0; i < tokenCount; i++)
    {
      tokenAddresses[i] = card.tokens[i].tokenAddress;
      valueOrIds[i] = card.tokens[i].valueOrId;
    }
  }
}