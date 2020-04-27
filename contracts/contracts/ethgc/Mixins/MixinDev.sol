pragma solidity ^0.6.0;


/**
  Original Source: OpenZeppelin's Ownable
 */
contract MixinDev
{
  /**
    The developer's account.
   */
  address public dev;

  /**
    May only be called by the developer.

    Allows the dev to switch to a new account.
   */
  function devTransferAccount(
    address newDevAccount
  ) public
    onlyDev
  {
    require(newDevAccount != address(0));
    dev = newDevAccount;
  }

  /*********************************************************************************
    Internal
   ********************************************************************************/

  constructor (
  ) internal
  {
    dev = msg.sender;
  }

  /**
     @dev Throws if called by any account other than the owner.
    */
  modifier onlyDev()
  {
    require(msg.sender == dev);
    _;
  }
}
