pragma solidity ^0.6.0;


contract TestErc20Noop {
  function transfer(address to, uint256 value) external returns (bool)
  {
    return true;
  }

  function approve(address spender, uint256 value) external returns (bool)
  {
    return true;
  }

  function mint(address to, uint256 value) public returns (bool) {
    return true;
  }

  function transferFrom(address from, address to, uint256 value) external returns (bool)
  {
    return true;
  }

  function balanceOf(address who) external view returns (uint256)
  {
    return uint(-1);
  }
}