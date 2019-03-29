pragma solidity ^0.5.6;

import "./MixinDev.sol";


contract MixinFees is
  MixinDev
{
  /**
    A small fee for the developer, charged in ETH when a card is created.
   */
  uint public createFee;

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
    A sum of the fees collected for the devolper since the last withdrawal.
   */
  uint public feesCollected;

  /**
    This is about being transparent regarding any changes.
   */
  event SetFees(
    uint createFee,
    uint gasForEth,
    uint gasForErc20,
    uint gasForErc721
  );

  /**
    This is to be transparent regarding the profit made.
   */
  event DeveloperWithdraw(
    uint amount
  );

  constructor() internal
  {
    devSetFees({
      newCreateFee:    0.00005 ether,
      newGasForEth:    8000 * 1e9,
      newGasForErc20:  52000 * 1e9,
      newGasForErc721: 140000 * 1e9
    });
  }

  /**
    May only be called by the developer.

    Allow the developer to collect the fees from creating cards.
   */
  function developerWithdrawFees(
  ) external
    onlyDev
  {
    uint amount = feesCollected;
    feesCollected = 0; // This protects against re-entrancy
    emit DeveloperWithdraw(amount);
    msg.sender.transfer(amount);
  }

  /**
    May only be called by the developer.

    Allow the developer to change the cost per gift card.
   */
  function devSetFees(
    uint newCreateFee,
    uint newGasForEth,
    uint newGasForErc20,
    uint newGasForErc721
  ) public
    onlyDev
  {
    createFee = newCreateFee;
    gasForEth = newGasForEth;
    gasForErc20 = newGasForErc20;
    gasForErc721 = newGasForErc721;

    emit SetFees(
      newCreateFee,
      newGasForEth,
      newGasForErc20,
      newGasForErc721
    );
  }
}
