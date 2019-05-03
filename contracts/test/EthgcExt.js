const BigNumber = require("bignumber.js");
const init = require("./helpers/init");

contract("EthgcExt", accounts => {
  let ethgc, ethgcExt;

  before(async () => {
    [ethgc, ethgcExt] = await init(accounts);
  });
});
