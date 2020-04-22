pragma solidity 0.5.17;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Pausable.sol";


contract TestErc721Pausable is ERC721Mintable, ERC721Pausable {}