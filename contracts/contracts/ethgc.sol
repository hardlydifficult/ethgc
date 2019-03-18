pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";

/**
 * ethgc: Ethereum Gift Cards
 * 
 * Give away ETH, tokens, or NFTs using a redeem code.
 * https://github.com/hardlydifficult/ethgc
 */
contract ethgc is
  Ownable
{
  /**
   * This allows us to list outstanding cards for the creator.
   *
   * It also stores optional messages to display to the claimer.
   */
  event CreateCard(
    address indexed creator,
    bytes32 indexed redeemCodeHashHashHash
  );

  /**
   * For the creator, this with above reports which cards are claimed.
   *
   * For the claimer, this allows us to list all outstanding redeems.
   */
  event ClaimCard(
    address indexed claimer,
    bytes32 indexed redeemCodeHashHashHash    
  );

  /**
   * For the creator, this with above reports which cards are claimed.
   *
   * For the claimer, this allows us to list recent redeems.
   */
  event RedeemGift(
    address indexed redeemer,
    bytes32 indexed redeemCodeHashHashHash    
  );

  event SetFee(
    uint costToCreateCard
  );

  event OwnerWithdraw(
    uint amount
  );

  /**
   * A small fee for the developer, charged in ETH when a card is created.
   */
  uint public costToCreateCard;

  struct Card
  {
    address token;
    uint valueOrTokenId;
    address claimedBy;
    uint claimedAtTime;
  }

  mapping(bytes32 => Card) public redeemCodeHashHashHashToCard;
  uint public feesCollected;

  constructor()
  {
    ownerChangeFee(0.00005 ether);
  }

  /**
   * Create a new gift card.
   *
   * @param _token The address of the token or NFT to give away, or address(0) for ETH.
   * @param _valueOrTokenId The amount of ETH or tokens to give away, 
   * or if giving away an NFT this represents the tokenId
   * @param _redeemCodeHashHashHash keccak256(keccak256(keccak256('redeemCodeString')))
   * @param message An optional message to display to the redeemer
   * This is can only be read from the original tx params.
   *
   * When creating an ETH card:
   *   - Must include enough ETH to cover the gift value + costToCreateCard fee
   * When creating a ERC-20 card:
   *   - Must first call `approve` on the token contract
   *   - The value of the gift card will be transfered from your account to this contract
   *   - Must include enough ETH to cover the costToCreateCard fee
   * When create a ERC-721 card:
   *   - Must first call `approve` or `approveForAll` on the NFT contract
   *   - The NFT will be transfered from your account to this contract
   *   - Must include enough ETH to cover the costToCreateCard fee
   *
   * Additional ETH may be included as a tip to the developer.
   */
  function createCard(
    address _token,
    uint _valueOrTokenId,
    bytes32 _redeemCodeHashHashHash,
    string calldata _message
  ) external payable
  {
    require(_valueOrTokenId != 0, "INVALID_CARD_VALUE");
    uint ethRequired = costToCreateCard;
    if(_token == address(0))
    {
      ethRequired += _valueOrTokenId;
    }
    else if(IERC165(_token).supportsInterface(0x80ac58cd))
    { // 0x80ac58cd is from eip-721
      _transferNft(_token, _valueOrTokenId, msg.sender, address(this));
    }
    else 
    {
      _transferToken(_token, _valueOrTokenId, msg.sender, address(this));
    }
    // By allowing greater than here, a tip for the developer may be included
    require(msg.value >= ethRequired, "INSUFFICIENT_FUNDS");
    feesCollected += msg.value - _valueOrTokenId;
    require(
      redeemCodeHashHashHashToCard[_redeemCodeHashHashHash].valueOrTokenId == 0,
      "REDEEM_CODE_ALREADY_IN_USE"
    );
    redeemCodeHashHashHashToCard[_redeemCodeHashHashHash] = Card({
      token: _token,
      valueOrTokenId: _valueOrTokenId,
      claimedBy: address(0),
      claimedAtTime: 0
    });
    emit CreateCard(msg.sender, _redeemCodeHashHashHash);
  }

  /**
   * Called by the gift card recipient to claim the card before redemption.
   *
   * @param _redeemCodeHashHash keccak256(keccak256('redeemCodeString'))
   *
   * This is a security precaution.  If you were to submit the redeem code 
   * without first claiming the card, an observer could front-run your 
   * transaction by copying the code and submitting a transaction with more gas.
   *
   * If someone front-runs your claim you can try again 24 hours later.  
   * They may be able to delay you, but they will not be able to actually
   * redeem the card.
   */
  function claimCard(
    bytes32 _redeemCodeHashHash
  ) external
  {
    bytes32 hashHashHash = keccak256(abi.encodePacked(_redeemCodeHashHash));
    Card storage card = redeemCodeHashHashHashToCard[hashHashHash];
    require(card.claimedAtTime < now - 24 hours, "ALREADY_CLAIMED");
    require(card.valueOrTokenId > 0, "INVALID_CARD_OR_ALREADY_REDEEMED");
    require(card.claimedBy != msg.sender, "NO_RENEWING_CLAIMS");
    card.claimedBy = msg.sender;
    card.claimedAtTime = now;
    emit ClaimCard(msg.sender, hashHashHash);
  }

  /**
   * Called by the gift card recipient to redeem the gift after it was claimed.
   *
   * @param _redeemCodeHash keccak256('redeemCodeString')
   *
   * This should be called (and mined) within 24 hours of claiming so that
   * another user does not re-claim it and redeem your gift.
   */
  function redeemGift(
    bytes32 _redeemCodeHash
  ) external
  {
    bytes32 hashHashHash = keccak256(abi.encodePacked(keccak256(
      abi.encodePacked(_redeemCodeHash)
    )));
    Card memory card = redeemCodeHashHashHashToCard[hashHashHash];
    require(card.claimedBy == msg.sender, "MUST_CLAIM_FIRST");

    delete redeemCodeHashHashHashToCard[hashHashHash];

    if(card.token == address(0))
    {
      msg.sender.transfer(card.valueOrTokenId);
    }
    // 0x80ac58cd is from eip-721
    else if(IERC165(card.token).supportsInterface(0x80ac58cd))
    {
      _transferNft(card.token, card.valueOrTokenId, address(this), msg.sender);
    }
    else
    {
      _transferToken(card.token, card.valueOrTokenId, address(this), msg.sender);
    }
    emit RedeemGift(msg.sender, hashHashHash);
  }

  /**
   * Allow the developer to change the cost per gift card.
   */
  function ownerChangeFee(
    uint _costToCreateCard
  ) external
    onlyOwner
  {
    costToCreateCard = _costToCreateCard;
    emit SetFee(costToCreateCard);
  }

  /**
   * Allow the developer to collect the fees from creating cards (and tips if any).
   */
  function ownerWithdrawFees(
  ) external
    onlyOwner
  {
    uint amount = feesCollected;
    feesCollected = 0;
    msg.sender.transfer(amount);
    emit OwnerWithdraw(amount);
  }

  function _transferNft(
    address _token,
    uint _tokenId,
    address _from,
    address _to
  ) private
  {
    IERC721 nft = IERC721(_token);
    require(nft.ownerOf(_tokenId) == _from, "NOT_YOUR_NFT");
    nft.transferFrom(_from, _to, _tokenId);
    // Security: we require the owner changed instead of relying on the nft 
    // contract to revert on fail
    require(nft.ownerOf(_tokenId) == _to, "TRANSFER_FAILED");
  }

  function _transferToken(
    address _token,
    uint _value,
    address _from,
    address _to
  ) private
  {
    IERC20 token = IERC20(_token);
    uint balance = token.balanceOf(_to);
    token.transferFrom(_from, _to, _value);
    // Security: we require the balance instead of relying on the correct
    // return value from the token contract
    require(token.balanceOf(_to) > balance, "TRANSFER_FAILED");
  }
}