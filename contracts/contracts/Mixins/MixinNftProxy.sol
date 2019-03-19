pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";


/**
 * Interfaces with ERC721 NFTs.
 */
contract MixinNftProxy
{
  function _transferNft(
    address token,
    uint tokenId,
    address from,
    address to
  ) internal
  {
    IERC721 nft = IERC721(token);
    require(nft.ownerOf(tokenId) == from, "NOT_YOUR_NFT");
    nft.transferFrom(from, to, tokenId);
    // Security: we require the owner changed instead of relying on the nft 
    // contract to revert on fail
    require(nft.ownerOf(tokenId) == to, "TRANSFER_FAILED");
  }

  function _isNft(
    address token
  ) internal view
    returns (bool)
  {
    // 0x80ac58cd is from eip-721
    return IERC165(token).supportsInterface(0x80ac58cd);
  }
}