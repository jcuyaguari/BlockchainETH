const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'blue human protect utility dragon ginger sentence orbit tree price special talent';
module.exports = {
  networks: {
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    },
    rinkeby:{//Creamos esta para nuestra HDWallet
      provider: () => new HDWalletProvider(mnemonic,"https://rinkeby.infura.io/v3/8094d424d67c4216afe61807ed94fd2a"),
      network_id: 4
    }
  }
}