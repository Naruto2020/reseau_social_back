// initialisation du serveur express 
const path = require('path');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000 ; 

const coockieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const cors = require("cors");

// connexion au serveur de bdd via mongoose
const { mongoose } = require("./db.js");

// routage 

// on recupère le routage dans la variable controleProduit via la modularisation
var controleCptes = require("./controle/controleCptes");
//var controleImges = require("./controle/controleImges");


// gestion des dossiers
app.use("/public/",express.static(path.normalize(__dirname + '/public')));
app.use(coockieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended:true }));

var corsOptions = {
  origin: 'https://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors({ origin: "*", corsOptions}));

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.header({"Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"});
  next();
});


// on definit la connexion avec le server Bdd
app.use("/comptes", controleCptes);
//app.use("/images", controleImges);

const server =  app.listen(PORT, () => {
  console.log(` app ecoute sur le port ${PORT}`);
});


  //Partie WebSocket
  /* **** **** **** **** **** */
  
  // initialisation du soccket
  const ioServer = require("socket.io")(server);
  //const ioServer = new IOServer(server);  
  ioServer.on("connect", (socket) => {
    console.log("connexion websocket à un client ...");

    socket.on('petit test', (message) => {
      socket.emit(message);
    });
  });  
  



