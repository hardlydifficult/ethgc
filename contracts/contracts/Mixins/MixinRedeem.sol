pragma solidity ^0.5.6;

import "./MixinBank.sol";
import "./MixinCards.sol";
import "./ReentrancyGuard.sol";


contract MixinRedeem is
  ReentrancyGuard,
  MixinBank,
  MixinCards
{
  /**
    This allows us to see all of the gift cards redeemed to your account.

    And to report when a card was redeemed.

    This event may fire multiple times. That occurs when not all token types were
    withdrawn from the card (e.g. maybe one of the tokens was `paused`).

    @param account The account which received the tokens.
    @param cardAddress The card's address that was redeemed.
   */
  event Redeem(
    address indexed account,
    address indexed cardAddress,
    bool allSuccessful
  );

  /**
    Redeem a gift card by calling this method from the card's account.

    The funds must be sent to a different address as the card's account is not
    secure for continued use as we have to assume the card creator still has the
    redeem code.

    This is payable to allow the account to drain any surplus funds with a single
    transaction.  Any `msg.value` included is forwarded to the `sendTo` account.

    @param sendTo The account to receive the tokens.
    @param tokenType 0: send all, value: send only a ERC20 or ERC721, max: send ETH.
   */
  function redeem(
    address payable sendTo,
    address tokenType
  ) external payable
    nonReentrant
  {
    require(sendTo != address(0) && sendTo != msg.sender, "INVALID_DESTINATION");

    _sendGift(msg.sender, tokenType, sendTo);

    if(msg.value > 0)
    {
      sendTo.transfer(msg.value);
    }
  }

  /**
    Redeem a gift card to your account by submitting a signed message from the
    card's account approving the redeem.

    The format of the message should be:
    keccak256("\x19Ethereum Signed Message:\n32" + keccak256(this + msg.sender))

    @param cardAddresses an array of card addresses to redeem.
    @param v an array of the v component for signatures from each card.
    @param r an array of the r component for signatures from each card.
    @param s an array of the s component for signatures from each card.
    @param tokenType 0: send all, value: send only a ERC20 or ERC721, max: send ETH.
   */
  function redeemWithSignature(
    address[] calldata cardAddresses,
    uint8[] calldata v,
    bytes32[] calldata r,
    bytes32[] calldata s,
    address tokenType
  ) external
    nonReentrant
  {
    bytes32 message = keccak256(
      abi.encodePacked(
        "\x19Ethereum Signed Message:\n32",
        keccak256(
          abi.encodePacked(
            address(this),
            msg.sender
          )
        )
      )
    );

    uint length = cardAddresses.length;
    for(uint i = 0; i < length; i++)
    {
      require(
        ecrecover(message, v[i], r[i], s[i]) == cardAddresses[i],
        "INVALID_REDEEM_CODE"
      );

      _sendGift(cardAddresses[i], tokenType, msg.sender);
    }
  }

  /**
    Allows the creator of a card to get the money back, even if they do not
    remember the redeemCode itself. You can get a list of cards you created from
    event logs.

    Presumably the creator already knows the redemption codes. There's no way
    to trust that they do not. So a feature like this is nothing more than
    convenience. e.g. if you distribute a paper card and it is lost.

    @dev If a card is redeemed before this call is mined it will be skipped,
    allowing the others (if any) to be canceled. This means a transaction which
    results in a no-op will not revert.

    @param cardAddresses an array of the card addresses to cancel.
    @param tokenType 0: send all, value: send only a ERC20 or ERC721, max: send ETH.
   */
  function cancel(
    address[] calldata cardAddresses,
    address tokenType
  ) external
    nonReentrant
  {
    uint length = cardAddresses.length;
    for(uint i = 0; i < length; i++)
    {
      if(addressToCard[cardAddresses[i]].createdBy == msg.sender)
      {
        _sendGift(cardAddresses[i], tokenType, msg.sender);
      }
    }
  }

  /*********************************************************************************
    Internal
   ********************************************************************************/

  /**
    Be wary of reentrancy when calling this function.
   */
  function _sendGift(
    address cardAddress,
    address tokenType,
    address payable sendTo
  ) private
  {
    Card storage card = addressToCard[cardAddress];
    require(card.createdBy != address(0), "ALREADY_CLAIMED");

    bool allSuccessful = true;
    uint tokenCount = card.tokens.length;
    for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
    {
      Token storage token = card.tokens[tokenId];
      if(token.valueOrId > 0)
      {
        if(
          (tokenType == address(-1) || tokenType == token.tokenAddress)
          && _trySendToken(sendTo, token.tokenAddress, token.valueOrId)
        )
        {
          token.valueOrId = 0;
        }
        else
        {
          allSuccessful = false;
        }
      }
    }

    emit Redeem(sendTo, cardAddress, allSuccessful);

    if(allSuccessful)
    {
      delete addressToCard[cardAddress];
    }
  }
}
