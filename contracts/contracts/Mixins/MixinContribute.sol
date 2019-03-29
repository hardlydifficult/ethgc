pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./MixinBank.sol";
import "./MixinCards.sol";
import "./MixinFees.sol";
import "./ReentrancyGuard.sol";


contract MixinContribute is
  ReentrancyGuard,
  MixinFees,
  MixinBank,
  MixinCards
{
  using SafeMath for uint;

  /**
    Emitted when tokens are added to an existing card.

    This allows us to list contributions you have made.

    It also allows us to list contributors when viewing a card
    (which may or may not have been redeemed).

    @param account The account which added tokens to a card.
    @param cardAddress The card address which received a contribution.
   */
  event Contribute(
    address indexed account,
    address indexed cardAddress
  );

  /**
    Allows you to add tokens to any existing card.

    Only the original card creator can add a new token type, others can add more
    value for the types already included in the card.

    @param cardAddresses an array of the card addresses to create
    @param tokenAddresses an array of the tokens to be included with each card. The
    address represents the token/nft contract address or address(0) for ETH.
    @param valueOrIds The value to be included in the gift indexed by card and then
    by token. Note that the values are in the base unit (e.g. wei vs ether). For
    NFTs this value is the tokenId.
   */
  function contribute(
    address payable[] calldata cardAddresses,
    address[] calldata tokenAddresses,
    uint[] calldata valueOrIds
  ) external payable
    nonReentrant
  {
    uint cardCount = cardAddresses.length;
    uint totalFees = 0;

    for(uint cardId = 0; cardId < cardCount; cardId++)
    {
      Card storage card = addressToCard[cardAddresses[cardId]];
      require(
        card.createdBy != address(0),
        "ALREADY_CLAIMED"
      );

      uint cardFees = _contributeToCard(
        card,
        tokenAddresses,
        valueOrIds,
        valueOrIds.length > tokenAddresses.length ? cardId * cardCount : 0
      );
      cardAddresses[cardId].transfer(cardFees);
      totalFees += cardFees;

      emit Contribute(msg.sender, cardAddresses[cardId]);
    }

    _takeTokens(tokenAddresses, valueOrIds, cardAddresses.length, totalFees);
  }

  function _contributeToCard(
    Card storage card,
    address[] memory tokenAddresses,
    uint[] memory valueOrIds,
    uint tokenOffset
  ) private
    returns (uint cardFees)
  {
    uint tokenCount = tokenAddresses.length;
    for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
    {
      uint value = valueOrIds[tokenOffset + tokenId];
      require(value != 0, "INVALID_CARD_VALUE");

      uint tokenIndex = uint(-1);
      if(!_isNft(tokenAddresses[tokenId]))
      {
        uint existingTokenCount = card.tokens.length;
        for(uint existingTokenId = 0; existingTokenId < existingTokenCount; existingTokenId++)
        {
          if(card.tokens[existingTokenId].tokenAddress == tokenAddresses[tokenId])
          {
            tokenIndex = existingTokenId;
            break;
          }
        }
      }
      if(tokenIndex == uint(-1))
      { // This is a new token type
        require(msg.sender == card.createdBy, "ONLY_CREATOR_CAN_ADD_TOKEN_TYPES");
        card.tokens.push(Token(tokenAddresses[tokenId], value));
        require(card.tokens.length < 5, "OVER_MAX_TOKENS_PER_CARD");
        if(tokenAddresses[tokenId] == address(0))
        {
          cardFees += gasForEth;
        }
        else if(_isNft(tokenAddresses[tokenId]))
        {
          cardFees += gasForErc721;
        }
        else
        {
          cardFees += gasForErc20;
        }
      }
      else
      {
        card.tokens[tokenIndex].valueOrId += value;
      }
    }
  }
}
