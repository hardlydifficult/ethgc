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

  function redeem(
    address redeemCode,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external
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
      ecrecover(message, v, r, s) == redeemCode,
      "INVALID_REDEEM_CODE"
    );
  
    _sendGift(redeemCode);
  }


  function _sendGift(
    address redeemCode
  ) internal
  {
    // Using memory instead of storage so we can delete right away and avoid re-entrancy
    Card memory card = redeemCodeAddressToCard[redeemCode];
    require(card.valueOrTokenId != 0, 'ALREADY_CLAIMED');
    delete redeemCodeAddressToCard[redeemCode];

    if(card.token == address(0))
    {
      msg.sender.transfer(card.valueOrTokenId);
    }
    else if(_isNft(card.token))
    {
      _transferNft(card.token, card.valueOrTokenId, address(this), msg.sender);
    }
    else
    {
      _transferToken(card.token, card.valueOrTokenId, address(this), msg.sender);
    }

    emit Redeem(msg.sender, redeemCode);
  }
}
