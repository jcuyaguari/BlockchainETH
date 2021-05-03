import Web3 from 'web3';


const getWeb3 = () => {
    return new Promise((resolve, reject)=>{//retorna una promesa ya q es asincrona.
        window.addEventListener('load',function(){//espera que cargue la pagina
            let web3 = window.web3; //alamcena la version q esta en el navegador

            if(typeof web3 !== undefined){//valida q tenemos disponile web3 en el nav
                web3 = new Web3(web3.currentProvider);
                resolve(web3);//cuando encuentra

            }else{
                console.error("Proveedor no encontrado, porfavor instale Netmask");
                reject();//cuando no le encuentra
            }
        });
    });
};


//Exportamso la funcion

export default getWeb3;