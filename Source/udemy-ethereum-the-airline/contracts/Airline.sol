pragma solidity ^0.4.24;

contract Airline {
    //podemos usar herencia para realizar el owner.
    address public owner;
    //Define nuestro cliente
    struct Customer{
        uint loyaltyPoints;//puntos de lealtad del cliente
        uint totalFlights;//Total de vuelos
    }

    struct Flight {
        string name;
        uint price; //uint256 es = uint

    }

    //Define cuanto vale un punto de loyalty en ether
    uint etherPerPoint = 0.5 ether;


    //Coleccion de vuelos que sea visibles de manera publica
    Flight[] public flights;
    
    mapping(address => Customer) public customers;//permite identificar al cliente para asignarle vuelo
    mapping(address => Flight[]) public customerFlights;//cuales son los vuelos que tiene comprado se crea Array
    mapping(address => uint) public customerTotalFlights;//Total de vuelos que ha comprado
    
    //Vuelos que son emitidos indexa
    event FlightPurchased(address indexed customer, uint price, string flight);
    
    constructor(){
        owner = msg.sender;
        flights.push(Flight('Ecuador',4 ether)); //Crear un vuelo
        flights.push(Flight('Miami',3 ether)); //Crear un vuelo
        flights.push(Flight('Cuenca',3 ether)); //Crear un vuelo
    }
    //REcibe un indice q representa el # de vuelo que vamos a comprar y payable porque recibe divisa
    function buyFlight(uint flightIndex) public payable {
        Flight flight = flights[flightIndex];//pasamos el user
        require(msg.value == flight.price); //se requiere que el user este pasando la cantidad del vuelo

        Customer storage customer = customers[msg.sender];//Se le pasa la direccion de quien envia la transaccion
        customer.loyaltyPoints += 5;// incrementa 5 cuando compra vuelo
        customer.totalFlights += 1;//se eleva el total de vuelos en una unidad
        customerFlights[msg.sender].push(flight); // Anade el vuelo de la persona
        customerTotalFlights[msg.sender] ++; //Total de vuelos

        //emit FlightPurchased(msg.sender, flight.price);
        FlightPurchased(msg.sender, flight.price, flight.name);
    }

    //Numero total de vuelos que tiene disponible la aerolinea
    function totalFlights() public view returns (uint){
        return flights.length;
    }


    //Los clientes deben recuperar dinero en divisa o ethreum usando loyaltipoints
    //
    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund); //transfer de la cantidad que quiere devolverle
        customer.loyaltyPoints = 0;//No puede volver a redimir la cantidad de dinero

    }

    //Cantidad de loyaltypoint que dispone
    function getRefundableEther() public view returns (uint){
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    //Balance de la aerolinea
    function getAirlineBalance() public isOwner view returns (uint){
        address airlineAddress = this;
        return airlineAddress.balance;
    }

    //Dueno del contrato
    modifier isOwner(){
        require(msg.sender == owner);
        _;
    }
}