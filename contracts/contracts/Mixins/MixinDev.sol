pragma solidity ^0.5.6;


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
    address _dev
  ) public
    onlyDev
  {
    require(_dev != address(0));
    dev = _dev;
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
