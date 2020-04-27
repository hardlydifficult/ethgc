pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./MixinBank.sol";
import "./MixinCards.sol";
import "./MixinFees.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract MixinCreate is
  ReentrancyGuard,
  MixinFees,
  MixinBank,
  MixinCards
{
  using SafeMath for uint;

  /**
    Emitted when a new card is created.

    This allows us to list cards you have created.

    It also allows us to discover the originating tx which may include optional
    messages.

    @param account The account which made the card.
    @param card The card address just created.
   */
  event Create(
    address indexed account,
    address indexed card
  );

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
    Create new gift card(s), each with the same gift value.

    The ETH value included should equal:
      (gift ETH + `redeemGas` + `fee`) * numberOfCards

    Before including ERC20 or ERC721 call `approve` or `approveForAll` on the
    token/nft contract, allowing this contract to transfer tokens on your behalf.
    The tokens/nft will be held by this contract until the gift code is redeemed.

    If an NFT is included then there must be only one card. See TODO to bulk create
    NFT cards.

    @param cardAddresses an array of the card addresses to create
    @param tokenAddresses an array of the tokens to be included with each card. The
    address represents the token/nft contract address or address(0) for ETH.
    @param valueOrIds The value to be included in the gift indexed by card and then
    by token. Note that the values are in the base unit (e.g. wei vs ether). For
    NFTs this value is the tokenId.
    @param description a string to be displayed when viewing the card.
    @param redeemedMessage a string to be displayed to the redeemer after a card has
    been redeemed.
   */
  function create(
    address payable[] calldata cardAddresses,
    address[] calldata tokenAddresses,
    uint[] calldata valueOrIds,
    string calldata description,
    string calldata redeemedMessage
  ) external payable
    nonReentrant
  {
    _addToCard(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      true
    );
  }

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
    _addToCard(
      cardAddresses,
      tokenAddresses,
      valueOrIds,
      false
    );
  }

  /*********************************************************************************
    Internal
   ********************************************************************************/

  function _addToCard(
    address payable[] memory cardAddresses,
    address[] memory tokenAddresses,
    uint[] memory valueOrIds,
    bool isNewCard
  ) internal
  {
    uint ethRequired = 0;
    if(isNewCard)
    {
      // Create fee
      ethRequired = gasForRedeem * cardAddresses.length;
    }

    bool isEntryPerCard = valueOrIds.length > tokenAddresses.length;

    for(uint cardId = 0; cardId < cardAddresses.length; cardId++)
    {
      Card storage card = addressToCard[cardAddresses[cardId]];
      uint cardFees = 0;

      if(isNewCard)
      {
        require(
          card.createdBy == address(0),
          "REDEEMCODE_ALREADY_IN_USE"
        );

        // set on create
        card.createdBy = msg.sender;

        emit Create(msg.sender, cardAddresses[cardId]);
      }
      else
      {
        require(
          card.createdBy != address(0),
          "REDEEMCODE_DOES_NOT_EXIST"
        );

        emit Contribute(msg.sender, cardAddresses[cardId]);
      }

      uint tokenOffset = valueOrIds.length > tokenAddresses.length
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
            || !_isNft(tokenAddresses[tokenId])
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
          require(
            msg.sender == card.createdBy,
            "ONLY_CREATOR_CAN_ADD_TOKEN_TYPES"
          );

          card.tokens.push(Token(
            tokenAddresses[tokenId],
            valueOrId
          ));

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
        { // if existing token, add to current value.
          card.tokens[tokenIndex].valueOrId += valueOrId;
        }

        if(isEntryPerCard)
        {
          ethRequired += _takeToken(
            tokenAddresses[tokenId],
            valueOrId
          );
        }
        else if(cardId == 0)
        { // if !isEntryPerCard then take only once, for the first card.
          ethRequired += _takeToken(
            tokenAddresses[tokenId],
            valueOrId.mul(cardAddresses.length)
          );
        }
      }
      cardAddresses[cardId].transfer(cardFees);
      ethRequired += cardFees;

      // Check this after adding tokens so that we can check once for contribute.
      require(card.tokens.length < 5, "OVER_MAX_TOKENS_PER_CARD");
    }

    // check the total count after creating
    require(msg.value == ethRequired, "INSUFFICIENT_FUNDS");
  }
}
