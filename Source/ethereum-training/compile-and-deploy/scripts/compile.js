const path = require('path');//lib rutas y sistemas de acrhivos
const fs = require('fs');//lib ficheros en disco
const solc = require('solc');
const chalk = require('chalk');//lib para pintar en consola

const contractPath = path.resolve(__dirname,"../contracts","UsersContract.sol");
const source = fs.readFileSync(contractPath,'utf8');

//console.log(source);

//Compilamos todo el smartcontract
//Devuelve un objeto con varias propiedades
//const {interface, bytecode} = solc.compile(source,1).contracts[':UsersContract'];

module.exports = solc.compile(source, 1).contracts[':UsersContract'];

//console.log(chalk.green(bytecode));
//console.log(chalk.red(interface));

