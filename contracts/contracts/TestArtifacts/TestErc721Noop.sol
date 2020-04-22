pragma solidity ^0.5.6;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";


contract TestErc721Noop
{
  function balanceOf(address owner) public view returns (uint256 balance)
  {
    return uint(-1);
  }

  function ownerOf(uint256 tokenId) public view returns (address owner)
  {
    return address(tokenId);
  }

  function approve(address to, uint256 tokenId) public
  {}

  function getApproved(uint256 tokenId) public view returns (address operator)
  {
    return msg.sender;
  }

  function setApprovalForAll(address operator, bool _approved) public
  {
  }

  function isApprovedForAll(address owner, address operator) public view returns (bool)
  {
    return true;
  }

  function transferFrom(address from, address to, uint256 tokenId) public
  {
  }

  function safeTransferFrom(address from, address to, uint256 tokenId) public
  {
  }

  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public
  {
  }

  function mint(address to, uint256 tokenId) public returns (bool) 
  {
    return true;
  }
}