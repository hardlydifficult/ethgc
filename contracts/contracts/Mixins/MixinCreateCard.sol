pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./MixinSharedData.sol";
import "./MixinNftProxy.sol";
import "./MixinTokenProxy.sol";


contract MixinCreateCard is 
  MixinTokenProxy,
  MixinNftProxy,
  MixinSharedData
{
  using SafeMath for uint;

  /**
   * This allows us to list outstanding cards for the creator.
   *
   * It also allows us to discover the originating tx which may include
   * an optional message to display to the redeemer.
   */
  event CreateCard(
    address indexed creator,
    address indexed redeemCode
  );

  event ContributeToCard(
    address indexed supporter,
    address indexed redeemCode
  );

  /**
   * Create new gift card(s).
   *
   * When creating an ETH card:
   *   - Must include enough ETH to cover the gift value + costToCreateCard fee
   * When creating a ERC-20 card:
   *   - Must first call `approve` on the token contract
   *   - The value of the gift card will be transfered from your account to this contract
   *   - Must include enough ETH to cover the costToCreateCard fee
   * When create a ERC-721 card:
   *   - Must first call `approve` or `approveForAll` on the NFT contract
   *   - The NFT will be transfered from your account to this contract
   *   - Must include enough ETH to cover the costToCreateCard fee
   *
   * Additional ETH may be included as a tip to the developer.
   */
  function createCards(
    address[] calldata cardAddresses, // one per card
    address[] calldata tokenAddresses,
    uint[] calldata valueOrIds, // one per token
    string calldata description, 
    string calldata redeemedMessage
  ) external payable
  {
    uint cardCount = cardAddresses.length;
    uint tokenCount = tokenAddresses.length;
    require(tokenCount < 5, "OVER_MAX_TOKENS_PER_CARD");

    _takeTokens(tokenAddresses, valueOrIds, cardCount, costToCreateCard * cardCount);
    
    for(uint cardId = 0; cardId < cardCount; cardId++)
    {
      address cardAddress = cardAddresses[cardId];
      Card storage card = addressToCard[cardAddress];
      require(
        card.createdBy == address(0),
        "REDEEMCODE_ALREADY_IN_USE"
      );
      // TODO test gas using a Card storage reference and/or temp for cardAddress
      card.createdBy = msg.sender;
      card.tokenCount = tokenCount;
      for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
      {
        require(valueOrIds[tokenId] != 0, "INVALID_CARD_VALUE");

        card.indexToToken[tokenId] =
          Token(tokenAddresses[tokenId], valueOrIds[tokenId]);
      }

      emit CreateCard(msg.sender, cardAddress);
    }
  }

  function contributeToCard(
    address[] calldata cardAddresses,
    address[] calldata tokenAddresses,
    uint[] calldata valueOrIds // one per token
  ) external payable
  {
    uint cardCount = cardAddresses.length;
    uint tokenCount = tokenAddresses.length;
    require(tokenCount < 5, "OVER_MAX_TOKENS_PER_CARD"); // todo again if new

    _takeTokens(tokenAddresses, valueOrIds, cardCount, 0);

    for(uint cardId = 0; cardId < cardCount; cardId++)
    {
      address cardAddress = cardAddresses[cardId];
      Card storage card = addressToCard[cardAddress];
      require(
        card.createdBy != address(0),
        "ALREADY_CLAIMED"
      );
      for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
      {
        require(valueOrIds[tokenId] != 0, "INVALID_CARD_VALUE");

        address tokenAddress = tokenAddresses[tokenId];
        uint tokenIndex = uint(-1);
        uint existingTokenCount = card.tokenCount;
        for(uint existingTokenId = 0; existingTokenId < existingTokenCount; existingTokenId++)
        {
          if(card.indexToToken[existingTokenId].tokenAddress == tokenAddress)
          {
            tokenIndex = existingTokenId;
            break;
          }
        }
        if(tokenIndex == uint(-1))
        { // This is a new token type
          require(msg.sender == card.createdBy, "ONLY_CREATOR_CAN_ADD_TOKEN_TYPES");
          tokenIndex = card.tokenCount++;
          require(card.tokenCount < 5, "OVER_MAX_TOKENS_PER_CARD");
        }
        card.indexToToken[tokenIndex].valueOrId += valueOrIds[tokenId];
      }

      emit ContributeToCard(msg.sender, cardAddress);
    }
  }

  function _takeTokens(
    address[] memory tokenAddresses,
    uint[] memory valueOrIds,
    uint cardCount,
    uint fee
  ) private
  {
    uint tokenCount = tokenAddresses.length;
    uint ethRequired = fee;
    feesCollected += ethRequired;

    for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
    {
      uint valueOrId = valueOrIds[tokenId].mul(cardCount);
      require(valueOrId != 0, "INVALID_CARD_VALUE");
      address tokenAddress = tokenAddresses[tokenId];
      
      if(tokenAddress == address(0))
      {
        ethRequired += valueOrId;
      }
      else if(_isNft(tokenAddress))
      {
        require(cardCount == 1, "ONE_CARD_AT_A_TIME_FOR_NFT");
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
    }
    
    require(msg.value >= ethRequired, "INSUFFICIENT_FUNDS");
    // Any extra is a tip to the developer, thanks!
    feesCollected += msg.value - ethRequired;
  }
}
