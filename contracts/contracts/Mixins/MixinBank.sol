pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


contract MixinBank
{
  using SafeMath for uint;

  /*********************************************************************************
    Internal
   ********************************************************************************/

  /**
    Transfers a token from this contract to the redeemer of a card.

    @dev Be wary of re-entrancy when calling this method.

    @param tokenAddress address(0) represents ETH, otherwise it's the contract
    address for an ERC20 or ERC721.
    @param valueOrId If the token is an ERC721 then this represents the tokenId,
    otherwise it is the number of tokens this card contains.
   */
  function _trySendToken(
    address payable sendTo,
    address tokenAddress,
    uint valueOrId
  ) internal
    returns (bool)
  {
    if(tokenAddress == address(0))
    {
      return sendTo.send(valueOrId);
    }
    else if(_isNft(tokenAddress))
    {
      return _transferNft(tokenAddress, valueOrId, address(this), sendTo);
    }
    else
    {
      return _transferToken(tokenAddress, valueOrId, address(this), sendTo);
    }
  }

  /**
    Takes tokens from the msg.sender and stores them in the contract.

    tokenAddresses.length == values.length: take value * cardCount
    tokenAddresses.length == cardCount * values.length: a value entry per card and
    then per address.

    @dev Be wary of re-entrancy when calling this method.
   */
  function _takeTokens(
    address[] memory tokenAddresses,
    uint[] memory valueOrIds,
    uint cardCount,
    uint totalFees
  ) internal
  {
    uint tokenCount = tokenAddresses.length;
    uint ethRequired = totalFees;
    bool isEntryPerCard = valueOrIds.length > tokenCount;

    for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
    {
      address tokenAddress = tokenAddresses[tokenId];

      if(isEntryPerCard)
      {
        for(uint cardId = 0; cardId < cardCount; cardId++)
        {
          ethRequired += _takeToken(
            tokenAddress,
            valueOrIds[tokenId * cardCount + cardId]
          );
        }
      }
      else
      {
        ethRequired += _takeToken(
          tokenAddress,
          valueOrIds[tokenId].mul(cardCount)
        );
      }
    }

    require(msg.value == ethRequired, "INSUFFICIENT_FUNDS");
  }

  function _isNft(
    address token
  ) internal view
    returns (bool)
  {
    // 0x80ac58cd is from eip-721
    return IERC165(token).supportsInterface(0x80ac58cd);
  }

  /*********************************************************************************
    Private
   ********************************************************************************/

  function _takeToken(
    address tokenAddress,
    uint valueOrId
  ) private
    returns (uint ethRequired)
  {
    require(valueOrId != 0, "INVALID_CARD_VALUE");

    if(tokenAddress == address(0))
    {
      return valueOrId;
    }

    if(_isNft(tokenAddress))
    {
      require(
        _transferNft(tokenAddress, valueOrId, msg.sender, address(this)),
        "TRANSFER_FAILED"
      );
    }
    else
    {
      require(
        _transferToken(tokenAddress, valueOrId, msg.sender, address(this)),
        "TRANSFER_FAILED"
      );
    }

    return 0;
  }

  function _transferToken(
    address tokenAddress,
    uint value,
    address from,
    address to
  ) private
    returns (bool)
  {
    IERC20 token = IERC20(tokenAddress);
    uint balance = token.balanceOf(to);
    token.transferFrom(from, to, value);
    // Security: we require the balance instead of relying on the correct
    // return value from the token contract
    return token.balanceOf(to) > balance;
  }

  function _transferNft(
    address token,
    uint tokenId,
    address from,
    address to
  ) private
    returns (bool)
  {
    IERC721 nft = IERC721(token);
    require(nft.ownerOf(tokenId) == from, "NOT_YOUR_NFT");
    nft.transferFrom(from, to, tokenId);
    // Security: we require the owner changed instead of relying on the nft
    // contract to revert on fail
    return nft.ownerOf(tokenId) == to;
  }
}