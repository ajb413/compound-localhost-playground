# Compound Protocol Localhost Playground

This project sets up a fork of Ethereum mainnet on localhost:8545. It seeds the first account in the developer mnemonic with lots of protocol assets by impersonating whales and transfering. The first account will have a large COMP balance and enough voting power delegated to it to make a proposal.

## Testing

Developers can send transactions to the node using a web3 library. Hardhat can be used with a testing framework to test out protocol functionality like supply, borrow, governance proposal, etc.

To fast forward the block height, a function like this can be used:

```js
const hre = require('hardhat');

async function advanceBlockHeight(blocks) {
  const txns = [];
  for (let i = 0; i < blocks; i++) {
    txns.push(hre.network.provider.send('evm_mine'));
  }
  await Promise.all(txns);
}

await advanceBlockHeight(1000); // fast forward 1000 Ethereum blocks
```

## How to Run

Install Node.js. Next, set up the 2 environment variables to configure a JSON RPC URL that reads from Mainnet and also an Ethereum mnemonic.

Whale addresses for seeding your account can be configured at the top of `run-localhost-fork.js`.

```
export MAINNET_PROVIDER_URL="__your_json_rpc_mainnet_url_here__" ## try alchemy.com or infura.io
export DEV_ETH_MNEMONIC="clutch captain..."

npm install

node run-localhost-fork.js

 > 
 > Running a hardhat localhost fork of mainnet at http://localhost:8545
 > 
 > Impersonating AAVE whale on localhost...  0x5aB53EE1d50eeF2C1DD3d5402789cd27bB52c1bB
 > Impersonating BAT whale on localhost...  0xb6909b960dbbe7392d405429eb2b3649752b4838
 > Impersonating COMP whale on localhost...  0x2775b1c75658Be0F640272CCb8c72ac986009e38
 > Impersonating DAI whale on localhost...  0x6c6Bc977E13Df9b0de53b251522280BB72383700
 > Impersonating LINK whale on localhost...  0xa6Cc3C2531FdaA6Ae1A3CA84c2855806728693e8
 > Impersonating MKR whale on localhost...  0xe8c6c9227491C0a8156A0106A0204d881BB7E531
 > Impersonating SUSHI whale on localhost...  0x73A6a761FE483bA19DeBb8f56aC5bbF14c0cdad1
 > Impersonating TUSD whale on localhost...  0x1E8f1568B598908785064809ebf5745004CE3962
 > Impersonating UNI whale on localhost...  0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801
 > Impersonating USDC whale on localhost...  0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8
 > Impersonating USDT whale on localhost...  0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36
 > Impersonating WBTC whale on localhost...  0xCBCdF9626bC03E24f779434178A73a0B4bad62eD
 > Impersonating YFI whale on localhost...  0x04916039B1f59D9745Bf6E0a21f191D1e0A84287
 > Impersonating ZRX whale on localhost...  0x206376e8940e42538781cd94ef024df3c1e0fd43
 > Local test account successfully seeded with AAVE
 > Local test account successfully seeded with BAT
 > Local test account successfully seeded with COMP
 > Local test account successfully seeded with LINK
 > Local test account successfully seeded with DAI
 > Local test account successfully seeded with MKR
 > Local test account successfully seeded with SUSHI
 > Local test account successfully seeded with TUSD
 > Local test account successfully seeded with UNI
 > Local test account successfully seeded with USDC
 > Local test account successfully seeded with USDT
 > Local test account successfully seeded with WBTC
 > Local test account successfully seeded with ZRX
 > Local test account successfully seeded with YFI
 > AAVE amount in first localhost account wallet: 3200
 > BAT amount in first localhost account wallet: 1000000
 > COMP amount in first localhost account wallet: 250000
 > LINK amount in first localhost account wallet: 70000
 > DAI amount in first localhost account wallet: 2000000.0002008828
 > MKR amount in first localhost account wallet: 775
 > SUSHI amount in first localhost account wallet: 99999.99999999999
 > TUSD amount in first localhost account wallet: 99999.99999999999
 > UNI amount in first localhost account wallet: 75000
 > USDC amount in first localhost account wallet: 50000000
 > USDT amount in first localhost account wallet: 10000000
 > WBTC amount in first localhost account wallet: 700
 > ZRX amount in first localhost account wallet: 25000000
 > YFI amount in first localhost account wallet: 15
 > 
 > Self-delegating COMP for 0th account...
 > Delegate votes succeeded
 > 
 > Ready to test locally! To exit, hold Ctrl+C.

```
