pragma solidity ^0.5.6;


interface ICard
{
  /**
    Represents a token type its value contained within the card.
    @param tokenAddress address(0) represents ETH, otherwise it's the contract
    address for an ERC20 or ERC721.
    @param valueOrId If the token is an ERC721 then this represents the tokenId,
    otherwise it is the number of tokens this card contains.
   */
  struct Token
  {
    address tokenAddress;
    uint valueOrId;
  }

  /**
    Stores data for an individual card, namely a collection of Tokens.
   */
  struct Card
  {
    address createdBy;
    Token[] tokens;
  }
}