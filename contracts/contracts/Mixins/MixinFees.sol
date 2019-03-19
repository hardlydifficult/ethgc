pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MixinSharedData.sol";


/**
 * Allows the developer to charge a small fee for this service.
 */
contract MixinFees is 
  Ownable,
  MixinSharedData
{
  event SetCostToCreateCard(
    uint costToCreateCard
  );

  event DeveloperWithdraw(
    uint amount
  );
  
  constructor() internal
  {
    developerSetCostToCreateCard(0.00005 ether);
  }

  /**
   * Allow the developer to collect the fees from creating cards.
   */
  function developerWithdrawFees(
  ) external
    onlyOwner
  {
    uint amount = feesCollected;
    feesCollected = 0;
    msg.sender.transfer(amount);
    emit DeveloperWithdraw(amount);
  }

  /**
   * Allow the developer to change the cost per gift card.
   */
  function developerSetCostToCreateCard(
    uint newCostToCreateCard
  ) public
    onlyOwner
  {
    costToCreateCard = newCostToCreateCard;
    emit SetCostToCreateCard(costToCreateCard);
  }
}
