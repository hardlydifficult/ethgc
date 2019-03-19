pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


/**
 * Interfaces with ERC20 tokens.
 */
contract MixinTokenProxy
{
  function _transferToken(
    address tokenAddress,
    uint value,
    address from,
    address to
  ) internal
  {
    IERC20 token = IERC20(tokenAddress);
    uint balance = token.balanceOf(to);
    token.transferFrom(from, to, value);
    // Security: we require the balance instead of relying on the correct
    // return value from the token contract
    require(token.balanceOf(to) > balance, "TRANSFER_FAILED");
  }
}