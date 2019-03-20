pragma solidity ^0.5.6;

import "./MixinSharedData.sol";
import "./MixinTokenProxy.sol";
import "./MixinNftProxy.sol";


/**
 * Allows people to claim and redeem a gift card they have received.
 *
 * This uses the following process to prevent front-running attacks:
 *
 * Secure Secret Reveal:
 * tx1(hash(hash(hash(redeemCode)+salt))), hash(hash(redeemCode)+salt+msg.sender));
 * ...wait for confirmation
 * tx2(hash(hash(redeemCode)+salt)));
 * ...wait for confirmation
 * tx3(hash(redeemCode)+salt);
 */
contract MixinRedeemCard is
  MixinTokenProxy,
  MixinNftProxy,
  MixinSharedData
{
  /**
   * For the creator, this with above reports where their cards are in the 
   * redemption process.
   *
   * For the redeemer, this allows us to list all outstanding redeems.
   */
  event Redeem(
    address indexed redeemer,
    address indexed redeemCode   
  );

  /**
   * @param tokenAddress 0 == eth, value == ERC20/ERC721, max == send all
   */
  function redeemCard(
    address cardAddress,
    uint8 v,
    bytes32 r,
    bytes32 s,
    address tokenAddress
  ) external
    returns (bool)
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

    require(
      ecrecover(message, v, r, s) == cardAddress,
      "INVALID_REDEEM_CODE"
    );
  
    _sendGift(cardAddress, tokenAddress);
  }

  /**
   * @param tokenAddress 0 == ETH, value == ERC20/ERC721, max == send all
   */
  function _sendGift(
    address cardAddress,
    address tokenAddress
  ) internal // TODO add a re-entrancy guard
  {
    Card storage card = addressToCard[cardAddress];
    require(card.createdBy != address(0), 'ALREADY_CLAIMED');

    bool allSuccessful = true;
    uint tokenCount = card.tokenCount;
    for(uint tokenId = 0; tokenId < tokenCount; tokenId++)
    {
      Token storage token = card.indexToToken[tokenId];
      if(token.valueOrId > 0)
      {
        if(
          (tokenAddress == address(-1) || tokenAddress == token.tokenAddress)
          && _send(token)
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

    emit Redeem(msg.sender, cardAddress);

    if(allSuccessful)
    {
      delete addressToCard[cardAddress];
    }
  }

  function _send(
    Token storage token
  ) private
    returns (bool)
  {
    if(token.tokenAddress == address(0))
    {
      return msg.sender.send(token.valueOrId);
    }
    else if(_isNft(token.tokenAddress))
    {
      return _transferNft(token.tokenAddress, token.valueOrId, address(this), msg.sender);
    }
    else
    {
      return _transferToken(token.tokenAddress, token.valueOrId, address(this), msg.sender);
    }
  }
}
