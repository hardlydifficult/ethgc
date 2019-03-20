pragma solidity ^0.5.6;

import "./MixinSharedData.sol";
import "./MixinNftProxy.sol";
import "./MixinTokenProxy.sol";


contract MixinCreateCard is 
  MixinTokenProxy,
  MixinNftProxy,
  MixinSharedData
{
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

  /**
   * Create a new gift card.
   *
   * @param token The address of the token or NFT to give away, or address(0) for ETH.
   * @param valueOrTokenId The amount of ETH or tokens to give away, 
   * or if giving away an NFT this represents the tokenId
   * @param redeemCode TODO describe variable
   * @param message An optional message to display to the redeemer
   * This is can only be read from the original tx params.
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
  function createCard(
    address token,
    uint valueOrTokenId,
    address redeemCode,
    string calldata message
  ) external payable
  {
    require(valueOrTokenId != 0, "INVALID_CARD_VALUE");
    require(redeemCode != address(0), "INVALID_ADDRESS");
    uint ethRequired = costToCreateCard;
    if(token == address(0))
    {
      ethRequired += valueOrTokenId;
    }
    else if(_isNft(token))
    { 
      _transferNft(token, valueOrTokenId, msg.sender, address(this));
    }
    else 
    {
      _transferToken(token, valueOrTokenId, msg.sender, address(this));
    }

    require(
      redeemCodeAddressToCard[redeemCode].valueOrTokenId == 0,
      "REDEEMCODE_ALREADY_IN_USE"
    );
    // By allowing greater than here, a tip for the developer may be included
    require(msg.value >= ethRequired, "INSUFFICIENT_FUNDS");

    feesCollected += msg.value - valueOrTokenId;
    redeemCodeAddressToCard[redeemCode] = Card({
      createdBy: msg.sender,
      token: token,
      valueOrTokenId: valueOrTokenId
    });

    emit CreateCard(msg.sender, redeemCode);
  }
}
