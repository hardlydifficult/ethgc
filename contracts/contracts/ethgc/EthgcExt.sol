pragma solidity ^0.6.0;

import "./Ethgc.sol";
import "./interfaces/ICard.sol";

/**
  @title ethgc.com extensions (read-only helper functions)
  @author HardlyDifficult
 */
contract EthgcExt is
  ICard
{
  Ethgc private _ethgc;

  constructor(Ethgc ethgc) public {
    _ethgc = ethgc;
  }

  function ethgc(
  ) external view
    returns (Ethgc)
  {
    return _ethgc;
  }

  function getFees(
    address payable[] calldata cardAddresses,
    address[] calldata tokenAddresses,
    uint[] calldata valueOrIds,
    bool isNewCard
  ) external view
    returns (uint redemptionGas)
  {
    bool isEntryPerCard = valueOrIds.length > tokenAddresses.length;

    for(uint cardId = 0; cardId < cardAddresses.length; cardId++)
    {
      Card memory card = _getCard(cardAddresses[cardId]);
      uint tokenOffset = isEntryPerCard
        ? cardId * cardAddresses.length
        : 0;

      for(uint tokenId = 0; tokenId < tokenAddresses.length; tokenId++)
      {
        uint valueOrId = valueOrIds[tokenOffset + tokenId];
        require(valueOrId != 0, "INVALID_CARD_VALUE");

        // contribute: Discover existing token if applicable
        uint tokenIndex = uint(-1);
        if(isNewCard && (
            tokenAddresses[tokenId] == address(0)
            || !_ethgc.isNft(tokenAddresses[tokenId])
            ))
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
        { // New token type for the card
          if(tokenAddresses[tokenId] == address(0))
          {
            redemptionGas += _ethgc.gasForEth() * cardAddresses.length;
          }
          else if(_ethgc.isNft(tokenAddresses[tokenId]))
          {
            redemptionGas += _ethgc.gasForErc721() * cardAddresses.length;
          }
          else
          {
            redemptionGas += _ethgc.gasForErc20() * cardAddresses.length;
          }
        }
      }
    }
  }

  function getFirstCard(
    address[] calldata cardAddresses
  ) external view
    returns (
      address cardAddress,
      address createdBy,
      address[] memory tokenAddresses,
      uint[] memory valueOrIds
    )
  {
    uint length = cardAddresses.length;
    for(uint i = 0; i < length; i++)
    {
      cardAddress = cardAddresses[i];
      (createdBy, tokenAddresses, valueOrIds) = _ethgc.getCard(cardAddress);
      if(createdBy != address(0)) {
        break;
      }
    }
  }

  function _getCard(
    address cardAddress
  ) private view
    returns (Card memory)
  {
    (
      address createdBy,
      address[] memory tokenAddresses,
      uint[] memory valueOrIds
    ) = _ethgc.getCard(cardAddress);
    uint length = tokenAddresses.length;
    Token[] memory tokens = new Token[](length);
    for(uint i = 0; i < length; i++)
    {
      tokens[i] = Token(tokenAddresses[i], valueOrIds[i]);
    }
    return Card(createdBy, tokens);
  }
}
