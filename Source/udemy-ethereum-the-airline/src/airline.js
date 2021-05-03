
//Recuperamos los artefactos de salida de compilaciion de truffel

//referenciamos a airline.json
import AirlineContract from "../build/contracts/Airline.json";
import contract from "truffle-contract";

//Exportamos una funcion provider 
export default async(provider)=>{
    const airline = contract(AirlineContract);
    airline.setProvider(provider);//pasa el provider

    let instance = await airline.deployed();//es asincrono
    return instance;
}