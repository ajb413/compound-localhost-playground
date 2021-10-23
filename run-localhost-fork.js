const hre = require('hardhat');
const { TASK_NODE_CREATE_SERVER } = require('hardhat/builtin-tasks/task-names');
const Compound = require('@compound-finance/compound-js');
const jsonRpcUrl = 'http://localhost:8545';

// Amount of tokens to seed in the 0th account on localhost
// Uncomment a line below to seed the account with that asset
// Hardhat impersonates the provided whale account and transfers (amt) tokens
// Use Compound.util.getAddress('cUSDC') or similar for `whale` to use a cToken contract
const seedMeWith = {
  'AAVE'  : { 'whale': '0x5aB53EE1d50eeF2C1DD3d5402789cd27bB52c1bB', 'amt': 3200     },
  'BAT'   : { 'whale': '0xb6909b960dbbe7392d405429eb2b3649752b4838', 'amt': 1000000  },
  'COMP'  : { 'whale': '0x2775b1c75658Be0F640272CCb8c72ac986009e38', 'amt': 250000   },
  'DAI'   : { 'whale': '0x6c6Bc977E13Df9b0de53b251522280BB72383700', 'amt': 2000000  },
  'LINK'  : { 'whale': '0xa6Cc3C2531FdaA6Ae1A3CA84c2855806728693e8', 'amt': 70000    },
  'MKR'   : { 'whale': '0xe8c6c9227491C0a8156A0106A0204d881BB7E531', 'amt': 775      },
  'SUSHI' : { 'whale': '0x73A6a761FE483bA19DeBb8f56aC5bbF14c0cdad1', 'amt': 100000   },
  'TUSD'  : { 'whale': '0x1E8f1568B598908785064809ebf5745004CE3962', 'amt': 100000   },
  'UNI'   : { 'whale': '0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801', 'amt': 75000    },
  'USDC'  : { 'whale': '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8', 'amt': 50000000 },
  'USDT'  : { 'whale': '0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36', 'amt': 10000000 },
  'WBTC'  : { 'whale': '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD', 'amt': 700      },
  'YFI'   : { 'whale': '0x04916039B1f59D9745Bf6E0a21f191D1e0A84287', 'amt': 15       },
  'ZRX'   : { 'whale': '0x206376e8940e42538781cd94ef024df3c1e0fd43', 'amt': 25000000 },
};

// Set up localhost fork with Hardhat
(async function () {
  console.log(`\nRunning a hardhat localhost fork of mainnet at ${jsonRpcUrl}\n`);

  const jsonRpcServer = await hre.run(TASK_NODE_CREATE_SERVER, {
    hostname: 'localhost',
    port: 8545,
    provider: hre.network.provider,
  });

  await jsonRpcServer.listen();

  // Seed first account with ERC-20 tokens on localhost
  const assetsToSeed = Object.keys(seedMeWith);
  const seedRequests = [];
  assetsToSeed.forEach((asset) => { seedRequests.push(seed(asset.toUpperCase(), seedMeWith[asset].amt)) });
  await Promise.all(seedRequests);

  // Self-delegate the COMP tokens in the 0th account on localhost so it can propose
  console.log('\nSelf-delegating COMP for 0th account...');
  const provider = new Compound._ethers.providers.JsonRpcProvider(jsonRpcUrl);
  const accounts = await provider.listAccounts();
  const signer = provider.getSigner(accounts[0]);
  const compound = new Compound(signer);
  const delegateTx = await compound.delegate(accounts[0]);
  await delegateTx.wait(1);
  console.log('Delegate votes succeeded');

  console.log('\nReady to test locally! To exit, hold Ctrl+C.\n');

})().catch(console.error)

// Moves tokens from cToken contracts to the localhost address
// but this will work with any Ethereum address with a lot of tokens
async function seed(asset, amount) {
  const cTokenAddress = seedMeWith[asset].whale;
  const provider = new Compound._ethers.providers.JsonRpcProvider(jsonRpcUrl);
  const accounts = await provider.listAccounts();

  // Impersonate this address (only works in local testnet)
  console.log(`Impersonating ${asset} whale on localhost... `, seedMeWith[asset].whale);
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [ cTokenAddress ],
  });

  // Number of underlying tokens to mint, scaled up so it is an integer
  const amtBn = Compound._ethers.BigNumber.from(amount);
  const _10 = Compound._ethers.BigNumber.from(10);
  const exp = Compound._ethers.BigNumber.from(Compound.decimals[asset]);
  const numbTokensToSeed = amtBn.mul(_10.pow(exp)).toString();

  const signer = provider.getSigner(cTokenAddress);

  const gasPrice = '0'; // only works in the localhost dev environment
  // const gasPrice = await provider.getGasPrice();
  const transferTrx = await Compound.eth.trx(
    Compound.util.getAddress(asset),
    'function transfer(address, uint256) public returns (bool)',
    [ accounts[0], numbTokensToSeed ],
    { provider: signer, gasPrice }
  );
  await transferTrx.wait(1);

  console.log('Local test account successfully seeded with ' + asset);

  const balanceOf = await Compound.eth.read(
    Compound.util.getAddress(asset),
    'function balanceOf(address) public returns (uint256)',
    [ accounts[0] ],
    { provider }
  );

  const tokens = +balanceOf / Math.pow(10, Compound.decimals[asset]);
  console.log(asset + ' amount in first localhost account wallet:', tokens);
}
