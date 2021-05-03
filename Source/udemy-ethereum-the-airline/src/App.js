import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";//import modulo
import AirlineContract from "./airline";//Importamos airline
import { AirlineService } from "./airlineService";//va en llaves porque es export named y no defauld
import { ToastContainer } from "react-toastr";//Llama a los eventos en tiempo real
//Convertir a ether
const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(),'ether');
    }
}

export class App extends Component {

    //primero que se ejecuta es el constructor
    constructor(props) {
        super(props);
        //Manejar el estado de react
        this.state = {
            balance: 0, //para balance
            refundableEther:0, //para el canje
            account: undefined,
            flights: [],//Inicializa Flight
            customerFlights: [] //Trae vuelos 
        };
    }

    async componentDidMount(){//indica que el component se monto
        this.web3 = await getWeb3();
        //console.log(this.web3.version);
        
        //Llamamos a Ether
        this.toEther = converter(this.web3);

        //tenemos disponible a airlin.js
        this.airline = await AirlineContract(this.web3.currentProvider);

        //console.log(this.airline.buyFlight);
        this.airlineService = new AirlineService(this.airline);//Llama a airlinesService

        var account = (await this.web3.eth.getAccounts())[0];//ponemos parentesis para que la promesa se materialize
        //console.log(account);
        
        //Almacena la compra del vuelo 
        let flightPurchased = this.airline.FlightPurchased();
        //Permite suscribirnos a el evento de la compra de un vuelo
        flightPurchased.watch(function(err,result){
            const{customer, price,flight} = result.args;

            if(customer === this.state.account){
                console.log(this.state.account,`Compraste un vuelo a ${flight} with a cost of ${price}`);
            }else{//Lanza cuando no compramos nosotros
                this.container.success(`El ultimo cliente compro un vuelo a  ${flight} con un costo de ${price}`,'INFORMACION DEL VUELO');//Representa POP-UP color verde
            
            }

        }.bind(this));
        //REFRESCA LOS CAMBIOS EN lA PAGINA
  /**  this.web3.currentProvider.publicConfigStore.on('update',async function(event){
            this.setState({
                account: event.selectedAddress.toLowerCase()
            },()=>{//creamos callback
                this.load();
            });
        }.bind(this)); //cambia el scope de la app
    */
        ethereum.on('update',async function(event){
            this.setState({
                account: event.selectedAddress.toLowerCase()
            },()=>{//creamos callback
                this.load();
            });
        }.bind(this)); //cambia el scope de la app

        this.setState({
            account: account.toLowerCase() //cambia aminiscula como tiene metamask
        },() =>{//se crea esto porque account es asincrono y no se tiene la cuenta al iniciar app
            this.load();
        });
    }

    //Para el balance add balance:0, pinta en app.js --> Balance
    //Recupera el balance por web3 y lo estable en el propio estado del componente
    async getBalance(){
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        console.log(weiBalance)
        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    //Obtenemos los vuelos para renderizar
    async getFlights(){
        let flights = await this.airlineService.getFlights();
        this.setState({
            flights 
        });
    }

    //Trae lo del canje
    async getRefundablEther(){
        let refundableEther = this.toEther(await this.airlineService.getRefundablEther(this.state.account));
        this.setState({
            refundableEther
        });
    }
    
    //Metodo que ayuda al reembolso de Ether
    async refundLoyaltyPoints(){
        await this.airlineService.redeemLoyaltyPoints(this.state.account);
    }

    //Obtenemos los vuelos de la persona
    async getCustomerFlights(){
        let customerFlights = await this.airlineService.getCustomerFlights(this.state.account);
        this.setState({
            customerFlights
        });
    }


    //Metodo para la compra de vuelos desde el boton
    async buyFlight(flightIndex,flight){
        //console.log(flight,'name',flight.name)
        await this.airlineService.buyFlight(
            flightIndex,
            this.state.account,
            flight.price
        );
    }

    //Se encarga de inicializar nuestra app
    async load(){
        this.getBalance(); //llama a este metodo
        this.getFlights(); //llama a este metodo
        this.getCustomerFlights();//llama a este metodo
        this.getRefundablEther();
    }


    //trabaja con jsx
    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Bienvenido a la Airline Juan!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <label><strong>{this.state.account}</strong></label>
                        <span><strong>Balance:</strong> {this.state.balance} ETH</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">
                        <span>{this.state.refundableEther} <strong>eth</strong></span>
                        <button className="btn btn-sm bg-secondary" onClick={this.refundLoyaltyPoints.bind(this)}>Reembolso</button>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                        {this.state.flights.map((flight, i)=> {
                            return <div key={i}>
                                        <span> {i} <strong>{flight.name} -</strong></span>
                                        <span> Cost: {this.toEther(flight.price)}  </span>
                                        <button className="btn btn-sm btn-primary text-black" onClick={()=> this.buyFlight(i,flight)}>Comprar</button>
                                   </div>
                        })}

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">

                        {this.state.customerFlights.map((flight, i) => {
                            return <div key={i}>
                                        <span> {i} <strong>{flight.name} -</strong></span>
                                        <span> Cost: {this.toEther(flight.price)}  </span>
                                   </div>
                        })}

                    </Panel>
                </div>
            </div>
            <ToastContainer ref={(input)=>this.container = input} className="toast-top-right"/>
        </React.Fragment>
    }
}