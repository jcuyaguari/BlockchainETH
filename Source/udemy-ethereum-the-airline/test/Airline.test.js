const { default: Web3 } = require("web3");

const Airline = artifacts.require('Airline'); //definimos que queremos usar el smartcontract de airline

let instance;

//Creamos una nueva instancia
beforeEach(async()=>{
    instance = await Airline.new();//deployed() guardamos la instancia sin await se guarda la promesa

});

//Testear en truffle
contract('Airline', accounts =>{
    //Debe tener vuelos disponibles de manera inicial
    it('should hav available flights', async()=>{
        let total = await instance.totalFlights();
        assert(total > 0); //total.equals=3
    });

    //Debe permitir comprar vuelo si estos proveen un valor
    it('should allow customers to buy a flight providing its value', async()=>{
        let flight = await instance.flights(0);
        let flightName = flight[0], price = flight[1];
        //console.log(flight);

        await instance.buyFlight(0,{from: accounts[0], value: price });//compra vuelo
        let customerFlight = await instance.customerFlights(accounts[0],0);
        let customerTotalFlights = await instance.customerTotalFlights(accounts[0]);
        //console.log(customerFlight,customerTotalFlights);

        assert(customerFlight[0],flightName);
        assert(customerFlight[1],price);
        assert(customerTotalFlights,1);
    });

    it('should not allow customers to buy flights under the price', async()=>{
        let flight = await instance.flights(0);
        let price = flight[1] - 5000; //modifica para la exc
        try {
            await instance.buyFlight(0,{from:accounts[0], value:price });
        }
        catch(e){return; }
        assert.fail();
    });

    //Comprobar que el balance de getbalnce es el correcto
    it('should get the real balance of the contract',async()=>{
        let flight = await instance.flights(0);//recupera vuelo
        let price = flight[1];

        let flight2 = await instance.flights(1);
        let price2 = flight2[1];

        await instance.buyFlight(0,{from: accounts[0], value:price});
        await instance.buyFlight(1,{from: accounts[0], value:price2});
        
        let newAirlineBalance = await instance.getAirlineBalance();
        
        //debe ser del mismo precio de los dos vuelos que hemos comprado.
        assert.equal(newAirlineBalance.toNumber(),price.toNumber() + price2.toNumber());
        
    });

    //Test para ver los puntos del cliente.
    //permite canjear los puntos x divisa de threum
    it('should allow customers to redeem loyalty points', async()=>{
        let flight = await instance.flights(1);//recupera vuelo
        let price = flight[1]; //saca precio
        
        await instance.buyFlight(1, {from: accounts[0], value: price});

        let balance = await Web3.eth.getBalance(accounts[0]);//balance inicial
        await instance.redeemLoyaltyPoinst({from: accounts[0]});//canjea puntos

        let finalBalance = await Web3.eth.getBalance(accounts[0]); //balance final

        //setear a 0 los loyalty point unavez canjeados
        let customer = await instance.customers(accounts[0]);
        let loyaltyPoints = customer[0];

        assert(loyaltyPoints,0);
        assert(finalBalance > balance);


    });
});