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



app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
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
  



