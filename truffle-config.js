const { compile } = require('solc')
const HDWalletProvider = require('truffle-hdwallet-provider')
const NonceTrackerSubprovider = require('web3-provider-engine/subproviders/nonce-tracker')
const utils = require('web3-utils')
// export MNEMONIC = ''
const MNEMONIC = process.env.MNEMONIC || process.env.NMEMORIC
const hdWalletStartIndex = 0
const hdWalletAccounts = 1
let hdWalletProvider

const setupWallet = (
    url
) => {
    if (!hdWalletProvider) {
        hdWalletProvider = new HDWalletProvider(
            MNEMONIC,
            url,
            hdWalletStartIndex,
            hdWalletAccounts,
	)
        hdWalletProvider.engine.addProvider(new NonceTrackerSubprovider())
    }
    return hdWalletProvider
}

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    aurora: {
      provider: () => setupWallet('https://testnet.aurora.dev'),
      network_id: 0x4e454153,
      gas: 10000000,
      from: '0x256807C23d5085ad22CC124c00852eE60989fC3E'
    },
    testnet: {
      provider: () => setupWallet('http://localhost:8545'),
      network_id: 0x4e454153,
      gas: 10000000,
      from: '0x256807C23d5085ad22CC124c00852eE60989fC3E'
    },
    ropsten: {
      provider: () => setupWallet(`https://ropsten.infura.io/v3/${process.env.INFURA_TOKEN}`),
      network_id: 0x3,
      from: '0x256807C23d5085ad22CC124c00852eE60989fC3E',
      gas: 3 * 1000000,
      gasPrice: utils.toWei('8', 'gwei')
    }
  },
  
  compilers: {
    solc :{
      version: "^0.8.0",
    }
  }

};
