pragma solidity ^0.5.6;

import "./MixinDev.sol";


contract MixinFees is
  MixinDev
{
  /**
    The base gas fee to redeem a card.
   */
  uint public gasForRedeem;

  /**
    The amount of ETH to reserve to pay gas fees on redeem for a card which includes
    an ETH gift.
   */
  uint public gasForEth;

  /**
    The amount of ETH to reserve to pay gas fees on redeem for a card which includes
    an ERC20 token gift.
   */
  uint public gasForErc20;

  /**
    The amount of ETH to reserve to pay gas fees on redeem for a card which includes
    an ERC721 (NFT) gift.
   */
  uint public gasForErc721;

  /**
    This is about being transparent regarding any changes.
   */
  event SetFees(
    uint gasForRedeem,
    uint gasForEth,
    uint gasForErc20,
    uint gasForErc721
  );

  constructor() internal
  {
    devSetFees({
      newGasForRedeem: 10000 * 1e9, // TODO measure these
      newGasForEth:    78500 * 1e9, // all inclusive
      newGasForErc20:  52000 * 1e9,
      newGasForErc721: 140000 * 1e9
    });
  }

  /**
    May only be called by the developer.

    Allow the developer to change the cost per gift card.
   */
  function devSetFees(
    uint newGasForRedeem,
    uint newGasForEth,
    uint newGasForErc20,
    uint newGasForErc721
  ) public
    onlyDev
  {
    emit SetFees(
      newGasForRedeem,
      newGasForEth,
      newGasForErc20,
      newGasForErc721
    );
    
    gasForRedeem = newGasForRedeem;
    gasForEth = newGasForEth;
    gasForErc20 = newGasForErc20;
    gasForErc721 = newGasForErc721;
  }
}
