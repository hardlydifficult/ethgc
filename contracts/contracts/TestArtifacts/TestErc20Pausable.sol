pragma solidity ^0.5.6;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";


contract TestErc20Pausable is ERC20Mintable, ERC20Pausable {}