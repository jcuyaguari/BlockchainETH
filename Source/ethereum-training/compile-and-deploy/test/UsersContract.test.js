const assert = require('assert');
const AssertionError = require('assert').AssertionError;
const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
const web3 = new Web3(provider);

const { interface, bytecode } = require('../scripts/compile')

//Almacena las cuentas del proveedor
let accounts;
//Almacena la instancia de nuestro contrato 
let usersContract;

//Ejecuta el code que tiene en su interior
//antes de ejecutar cada test presente dentro del archivo
beforeEach(async() =>{
    //Recupara cuentas de ganache
    accounts = await web3.eth.getAccounts();
    //Desplegar en ganache smartcontract
    usersContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas:'1000000'});
});

//Escribi los tests
describe('The UsersContract', async() => {
    it('should deploy', () =>{
        //Verifica que el obj que le vamos a pasar tenga un valor
        console.log(usersContract.options.address);
        assert.ok(usersContract.options.address);
    }); 

    it('should join a user', async()=>{
        let name = "Juan";
        let surname = "Landeras";

        await usersContract.methods.join(name,surname)
            .send({from: accounts[0],gas:'500000'});
    });

    it('should retrieve a user', async()=>{
        let name = "Juan";
        let surname = "Landeras";

        await usersContract.methods.join(name,surname)
            .send({from: accounts[0], gas:'500000'});
        //pedir al smarcontrac que devuelva el user
        let user = await usersContract.methods.getUser(accounts[0]).call();//send envia call llama a la transaccion
        assert.equal(name, user[0]);
        assert.equal(surname, user[1]);
    });

    it('should not allow joining an account twice', async()=>{
        await usersContract.methods.join("Pablo","Canar")
            .send({from: accounts[1],gas:'500000'});
        try {
            // await usersContract.methods.join("Maria","Canar")
            // .send({from: accounts[1],gas:'500000'});
            assert.fail('Misma cuenta no puede iniciar dos veces');
        }
        catch(e){
            if(e instanceof AssertionError){
                assert.fail(e.message);
            }
        }
        
    });
});