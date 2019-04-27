pragma solidity ^0.5.6;

import "./Ethgc.sol";

/**
  @title ethgc.com extensions (read-only helper functions)
  @author HardlyDifficult
 */
contract EthgcExt
{
  Ethgc private _ethgc;

  constructor(Ethgc ethgc) public {
    _ethgc = ethgc;
  }

  function ethgc(
  ) external view
    returns (Ethgc)
  {
    return _ethgc;
  }

  function getFirstCard(
    address[] calldata cardAddresses
  ) external view
    returns (
      address cardAddress,
      address createdBy,
      address[] memory tokenAddresses,
      uint[] memory valueOrIds
    )
  {
    uint length = cardAddresses.length;
    for(uint i = 0; i < length; i++)
    {
      cardAddress = cardAddresses[i];
      (createdBy, tokenAddresses, valueOrIds) = _ethgc.getCard(cardAddress);
      if(createdBy != address(0)) {
        break;
      }
    }
  }
}
