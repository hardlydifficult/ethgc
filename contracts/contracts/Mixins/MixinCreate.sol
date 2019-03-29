pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./MixinBank.sol";
import "./MixinCards.sol";
import "./MixinFees.sol";
import "./ReentrancyGuard.sol";


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
  function createCards(
    address payable[] calldata cardAddresses,
    address[] calldata tokenAddresses,
    uint[] calldata valueOrIds,
    string calldata description,
    string calldata redeemedMessage
  ) external payable
    nonReentrant
  {
    uint totalFees = createFee * cardAddresses.length;
    feesCollected += totalFees;

    for(uint cardId = 0; cardId < cardAddresses.length; cardId++)
    {
      uint cardFees = _createCard(
        cardAddresses,
        cardId,
        tokenAddresses,
        valueOrIds
      );
      cardAddresses[cardId].transfer(cardFees);
      totalFees += cardFees;

      emit Create(msg.sender, cardAddresses[cardId]);
    }

    _takeTokens(tokenAddresses, valueOrIds, cardAddresses.length, totalFees);
  }

  function _createCard(
    address payable[] memory cardAddresses,
    uint cardId,
    address[] memory tokenAddresses,
    uint[] memory valueOrIds
  ) private
    returns (uint cardFees)
  {
    uint tokenOffset = valueOrIds.length > tokenAddresses.length ? cardId * cardAddresses.length : 0;

    Card storage card = addressToCard[cardAddresses[cardId]];
      require(
        card.createdBy == address(0),
        "REDEEMCODE_ALREADY_IN_USE"
      );
      card.createdBy = msg.sender;
    uint tokenCount = tokenAddresses.length;
    require(tokenCount < 5, "OVER_MAX_TOKENS_PER_CARD");

    for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
    {
      uint valueId = tokenOffset + tokenId;
      require(valueOrIds[valueId] != 0, "INVALID_CARD_VALUE");

      card.tokens.push(Token(
        tokenAddresses[tokenId],
        valueOrIds[valueId]
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
  }
}
