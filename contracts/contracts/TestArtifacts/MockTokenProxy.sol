pragma solidity ^0.5.6;

import "../Mixins/MixinTokenProxy.sol";


/**
 * Used only for testing.  Do not deploy to prod
 */
contract MockTokenProxy is
  MixinTokenProxy
{
  function transferToken(
    address tokenAddress,
    uint value,
    address from,
    address to
  ) external
  {
    _transferToken(tokenAddress, value, from, to);
  }
}