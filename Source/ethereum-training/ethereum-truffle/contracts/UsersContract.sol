pragma solidity ^0.4.24;

contract UsersContract {
    struct User {
        string name; //nombre
        string surName; //apellidos
    }
    //similar a diccionario
    mapping(address => User) private users;
    mapping(address => bool) private joinedUsers;//mapeo para ver si el usario se a registrado ya en un smart contract
    address[] total;//saber cual es el # de usr q se han registrado
    
    //event onUserJoined(address,string); //lanza un mensaje con info de lo q ha sucedido

    function join(string name, string surName)public {
        require(!userJoined(msg.sender));
        //memory no persiste, storage si
        User storage user = users[msg.sender];
        user.name = name;
        user.surName = surName;
        joinedUsers[msg.sender] = true;
        total.push(msg.sender);//registro de las direcciones q tenemos
        //onUserJoined(msg.sender, string(abi.encodePacked(name," ",surName)));
   }

    //recuperar nombre de usuario y direccion del user

    function getUser(address addr) public view returns (string, string) {
        require(userJoined(msg.sender));
        User memory user = users[addr]; //usa memory xq solo consulta
        return (user.name, user.surName);
    }

    function userJoined(address addr) private view returns (bool){
        return joinedUsers[addr];
    }

    function totalUsers() public view returns (uint){
        return total.length;
    }
}