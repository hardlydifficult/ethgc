pragma solidity ^0.6.0;

import "./MixinDev.sol";


contract MixinFees is
  MixinDev
{
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
    uint gasForEth,
    uint gasForErc20,
    uint gasForErc721
  );

  constructor() internal
  {
    devSetFees({
      newGasForEth:    82000 * 2e9,
      newGasForErc20:  150000 * 2e9,
      newGasForErc721: 200000 * 2e9 // TODO
    });
  }

  /**
    May only be called by the developer.

    Allow the developer to change the cost per gift card.
   */
  function devSetFees(
    uint newGasForEth,
    uint newGasForErc20,
    uint newGasForErc721
  ) public
    onlyDev
  {
    emit SetFees(
      newGasForEth,
      newGasForErc20,
      newGasForErc721
    );
    
    gasForEth = newGasForEth;
    gasForErc20 = newGasForErc20;
    gasForErc721 = newGasForErc721;
  }
}
