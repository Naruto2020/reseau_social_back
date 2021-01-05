// initialisation du routeur express
const express = require("express");
const router = express.Router();
const session = require("express-session");

const bcrypt = require('bcrypt');
const passport = require("passport");
const passportConfig = require("../passport.js");
const jwt = require("jsonwebtoken");

var async = require('async');
var CryptoJS = require("crypto-js");
var Crypto = require('ezcrypto').Crypto;
var crypto = require('crypto');

const nodemailer = require("nodemailer");
const details = require("../details.json");




const signToken = userID =>{
  return jwt.sign({
    iss : "OngolaKne",
    sub : userID
  }, "OngolaKne", {expiresIn : "1h"});
}


// import de l'objetId de mongoose
const ObjetId = require("mongoose").Types.ObjectId;
// import de l'objet modele Comptes
const { User } = require("../modele/comptes.js");
const {Image} = require("../modele/images.js");
const {ImagePro} = require("../modele/profils.js");
const {Amis} = require("../modele/amis.js");

//const { Image} = require("../modele/images.js");

// gestion des téléchargements d'images avec le module multer 
const multer = require("multer");
const { authenticate } = require("passport");
const { reset } = require("nodemon");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
      return  cb(null, "./public/uploads");
    },
    filename : function(req,file, cb){
      return  cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname);
    }
});
// gestion des extensions
const fileFilter = (req, file, cb)=>{
    // rejet du fichier 
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
     return  cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage:storage, 
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter: fileFilter

});


// gestion des origines 
//const CORS = require("cors");
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  

  router.use(
    session({
      secret: "OngolaKne",
      saveUninitialized: true,
      resave: true,
    })
  );

router.use(passport.initialize());
router.use(passport.session());

// routage
// pour afficher la liste d'ut (amis)
router.get("/users", (req, res)=>{
  User.find((err, docs)=>{
    if(!err){
      return  res.send(docs);
    }else{
      console.log("erreur de transmission de la liste des comptes:" + JSON.stringify(err, undefined, 2));
    }
  });
    //next();
    
});

// pour afficher un ut avec son ID 
router.get("/users/:id", (req, res)=>{
    // verrification de la validité de l'ID
    if(!ObjetId.isValid(req.params.id))
      return res.status(400).send(`Id incorrecte ${req.params.id}`);
    User.findById(req.params.id, (err, doc)=>{
        if(!err){
            res.send(doc);
        }else{
            console.log("erreur de transmission du comptes utilisateur:" + JSON.stringify(err, undefined, 2));
            
        }
    }); 
    

});

/****************************************************************************************************
 * ************ *********** gestion des images d'arrieres plans ************  ************
 */

// pour telecharger une image background
router.post("/images", upload.single("photo"), (req, res)=>{
  const file = req.file;
  console.log(file.filename);
  /*if(!file){
      const error = new Error('fichier introuvable');
      error.httpStatusCode=400;
      return next(error);
  }else{
      res.send(file);
      console.log(req.file.path);
  }*/


  
  const img = new Image({
    photo : req.file.path,
    loadBy : req.body.loadBy
  });
  console.log("voici l'image : ", img.photo);
  if(!req.body.loadBy){
    res.json({ success: false, message: 'Blog creator is required.' });
  }else{
    img.save((err, doc)=>{
      console.log(img);
  
      if(!err){
        return  res.send(doc);
      }else{
        console.log(
          " fichier introuvable et/ou erreur lors de l'enregistrement du fichier:" +
          JSON.stringify(err, undefined, 2)
        );
      }
               
    });
  }    

});

// pour afficher les images background
router.get("/images", (req, res)=>{
  Image.find((err, docs)=>{
    if(!err){
      return  res.send(docs);
    }else{
      console.log("erreur de transmission de la liste des comptes:" + JSON.stringify(err, undefined, 2));
    }
  });
  //next();

});

// pour recupérer l'image background courante
router.get("/images/:id", (req, res)=>{
  // verrification de la validité de l'ID
  if(!ObjetId.isValid(req.params.id))
    return res.status(400).send(`Id incorrecte ${req.params.id}`);
  Image.findById(req.params.id, (err, doc)=>{
      if(!err){
          res.send(doc);
      }else{
          console.log("erreur de transmission de l'image:" + JSON.stringify(err, undefined, 2));
          
      }
  }); 
  

});

// pour supprimer une image background
router.delete("/images/:id", (req, res, next) => {
  if (!ObjetId.isValid(req.params.id))
    return res.status(400).send(`id incorrecte ${req.params.id}`);
  Image.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "erreur lors de la suppression de l'image:" +
          JSON.stringify(err, undefined, 2)
      );
    }
  });
});

/***********************************************************************************************
 ***********  ********** gestion des images profils  ***********  ***************
 */

// pour telecharger une image de profil
router.post("/imagePros", upload.single("photo"), (req, res)=>{
  const file = req.file;
  console.log(file.filename);
  /*if(!file){
      const error = new Error('fichier introuvable');
      error.httpStatusCode=400;
      return next(error);
  }else{
      res.send(file);
      console.log(req.file.path);
  }*/
  
  const imgP = new ImagePro({
    photo : req.file.path,
    loadBy : req.body.loadBy
  });
  console.log("voici l'image : ", imgP.photo);
  if(!req.body.loadBy){
    res.json({ success: false, message: 'loadBy is required.' });
  }else{

    imgP.save((err, doc)=>{
      console.log(imgP);
      if(!err){
        return  res.send(doc);
      }else{
        console.log(
          " fichier introuvable et/ou erreur lors de l'enregistrement du fichier:" +
          JSON.stringify(err, undefined, 2)
          );
        }
    });
  }    


});

// pour afficher les images profil
router.get("/imagePros", (req, res)=>{
  ImagePro.find((err, docs)=>{
    if(!err){
      return  res.send(docs);
    }else{
      console.log("erreur de transmission de la liste des comptes:" + JSON.stringify(err, undefined, 2));
    }
  });
  //next();
});

// pour recupérer l'image profil courante
router.get("/imagePros/:id", (req, res)=>{
  // verrification de la validité de l'ID
  if(!ObjetId.isValid(req.params.id))
    return res.status(400).send(`Id incorrecte ${req.params.id}`);
  ImagePro.findById(req.params.id, (err, doc)=>{
      if(!err){
          res.send(doc);
      }else{
          console.log("erreur de transmission de l'image:" + JSON.stringify(err, undefined, 2));
          
      }
  }); 
  

});

// pour supprimer une image profil
router.delete("/imagePro/:id", (req, res, next) => {
  if (!ObjetId.isValid(req.params.id))
    return res.status(400).send(`id incorrecte ${req.params.id}`);
  ImagePro.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "erreur lors de la suppression de l'image:" +
          JSON.stringify(err, undefined, 2)
      );
    }
  });
});


// ajout d'un utilisateur 
router.post("/users", /*upload.single("photo"),*/ (req, res)=>{
  //const file = req.file;
 // console.log(file.filename);
 //var password = req.body.password;
 // bcrypt.hash(password, 10, function(err, hash) {
   // Store hash in your password DB.
    /*if(err){
        console.log("erreur de cryptage" + JSON.stringify(err, undefined, 2));
    }else{*/

      const  { nom, prenom, username, mail, password, age, coordonnees, genre, preferences, niveau, presentation, amis} = req.body;
      User.findOne({username}, (err, user)=>{
        if(err){
          res.status(500).json({message : {msgBody : "une erreur c'est produite", msgError:true}});
        }
        if(user){
          res.status(400).json({message : {msgBody : "pseudo déja utilisé", msgError:true}});

        }else{
          const newUser = new User({nom, prenom, username, mail, password, age, coordonnees, genre, preferences, niveau, presentation, amis});

          //enregistrement du profil 
          newUser.save((err,doc)=>{
            if(!err){
              //res.status(500).json({message : {msgBody : "erreur lors de l'enregistrement du profil", msgError:true}});
              res.send(doc);
            }else{
              //res.status(201).json({message : {msgBody : "profil créer avec sucsses", msgError:false}});
              console.log(
                "erreur lors de l'enregistrement du produit:" +
                JSON.stringify(err, undefined, 2));

            }

          });

        }
          
      });
       
   // }
  //});
  
}); 

// gestion de l'envois de l'email de confirmation 
router.post("/sendmail", (req, res)=>{
  let user = req.body;
  sendMail(user, info=>{
    console.log(`email envoyé et l'id est${info.messageId}`);
    res.send(info);
  });
  console.log(req.body);
  res.json({message: 'message recu !!!'});
});

async function sendMail(user, cb){
  // creation du transport réutilisable avec celui du SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user:details.mail, // generated ethereal user
      pass: details.password // generated ethereal password
    },
  });
  let mailOptions = {
    from: '"Swap-It 👻" ghpower409@gmail.com', // address email emettrice
    to: user.mail, // address email receptrice
    subject: "wellcome to Swap-It 👻 ✔", // Sujet 
    html: `<h1>Bonjour  ${user.username} </h1><br/>
    <h4>merci de rejoindre l'aventure Swap-It !</h4>
    <p>cliquez sur le lien http://localhost:4200/conectUser</p> `, 
  }
  // envois du mail et de son contenu 
  let info = await transporter.sendMail(mailOptions);
  console.log("send it ....");
  cb(info);
}

// gestion de la connexion 
router.post("/login", passport.authenticate('local', {session: false}), (req, res)=>{
  if (req.isAuthenticated()) {
    //console.log("Mail et/ou le mot de passe non fourni(s).");
    // authentification
    const { _id , username, password , niveau} = req.body;
    // autorisation JWT
    const token = signToken( _id );
    // gestion des cookies
    res.cookie('access_token', token, {httpOnly: true, sameSite:true});
    res.status(200).json({isAuthenticated : true, user : {_id ,username, password,niveau}});
    
  }
  
});    


// maj des données utilisateur 
router.put("/users/:id" , (req, res, next) => {
    if (!ObjetId.isValid(req.params.id))
      return res.status(400).send(`id incorrecte ${req.params.id}`);
      //const file = req.file;
      //console.log(file.filename);

    var password = req.body.password;
    bcrypt.hash(password, 10, function(err, hash) {
      //Store hash in your password DB.
      if(err){
        console.log("erreur de cryptage" + JSON.stringify(err, undefined, 2));
      }else{
        var newUser = {
                   // photo : req.file.path,
          nom : req.body.nom,
          prenom : req.body.prenom,
          username : req.body.username,
           mail : req.body.mail,
          password : hash,
          age : req.body.age,
          coordonnees : req.body.coordonnees,
          genre : req.body.genre,
          preferences:req.body.preferences,
          niveau : req.body.niveau,
          presentation : req.body.presentation,
        };

        User.findByIdAndUpdate(
            req.params.id,
            { $set: newUser },
            { new: true }, // cette option permet de retourner toutes les mises a jours dans la reponse
            (err, doc) => {
              if (!err) {
                res.send(doc);
              } else {
                console.log(
                  "erreur lors de la mise a jour du produit:" +
                  JSON.stringify(err, undefined, 2)
                      );
              }
            }
        ); 
      }
    });
        
          
});

/****************************************************************************************************
 *********   *********** **********    gestion du mot de passe *********  ********  *********
 */

// requête pour mot de passe oublier
router.post("/forgotPassword", (req, res, next)=>{
  async.waterfall([
    function(done){
      crypto.randomBytes(20, (err, buf)=>{
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function(token, done){
      User.findOne({username : req.body.username}, (err, user)=>{
        if( !user){
          return res.status(400).json({message : {msgBody : "l'utilisateur  n'existe pas.", msgError:true}});
        }
        user.reset = token;
        user.resetExpires =  Date.now() + 3600000; // 1 hour
        user.save((err)=>{
          done(err, token, user);
        });

      });

    },
    function(token, user, done){
      var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user:details.mail, // generated ethereal user
          pass: details.password // generated ethereal password
        },
      });
      let mailOptions = {
        from: '"Swap-It 👻" ghpower409@gmail.com', // address email emettrice
        to: user.mail, // address email receptrice
        subject: "wellcome to Swap-It 👻 ✔", // Sujet 
        html: `<h1>Bonjour  ${user.prenom} </h1><br/>
        <h4>Bienvenue sur Swap-It votre identifiant est ${user.username} et votre mot de passe est ${user.password} clicquez ici pour reinitialiser votre mot de passe !</h4>
        <p>http://localhost:4200/reset/${token} \n\n ignorez ce mail si vous n'ête pas l'auteur de la démarche<p>`, 
      };
      smtpTransport.sendMail(mailOptions, (err)=>{
        res.json({message: 'message recu !!!'});
        done(err,"done");
      });
    }
  ], function(err){
    if(err){
      return next(err);
    }
  });
});


// recupérer la clef token 
router.get("/reset/:token", (req, res)=>{
  User.findOne({reset:req.params.token, resetExpires: {$gt:Date.now()}}, (err, doc)=>{
    if(err){
      return res.status(400).json({message : {msgBody : "password reset token n'est pas valid.", msgError:true}});
    }
    res.status(200).json({ user : req.user});
    //res.send(doc);
  });
});

// reinitialiser le token (mot de passe )
router.post("/reset/:token", (req, res, next)=>{
  async.waterfall([
    function(done){

      User.findOne({reset:req.params.token, resetExpires: {$gt:Date.now()}}, (err, user)=>{
        console.log(req.params.token);
        
        if(!user){
           res.status(400).json({message : {msgBody : "password reset token n'est pas valid ou a expiré.", msgError:true}});
        }
        
        user.password = req.body.password;
        user.password1 = req.body.password1;
        user.reset = undefined;
        user.resetExpires = undefined;
        if(user.password !== user.password1){
          return res.status(500).json({message:{msgBody:"le mot de passe de confirmation doit être identique au nouveau mot de passe"}})
        }
        if(user.password === "" || user.password1 === ""){
          return res.status(500).json({message:{msgBody:"le mot de passe et/ou la confirmation doit être renseigné."}})

        }
        if(user.password.length < 8 || user.password1.length < 8){
          return res.status(500).json({message:{msgBody:"le mot de passe et/ou la confirmation doit être supérieure à 8 caractères."}})

        }

        user.save((err)=>{
          req.logIn(user, (err)=>{
            done(err, user);
          });
        });

      });
    },

    function( user, done){
      var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user:details.mail, // generated ethereal user
          pass: details.password // generated ethereal password
        },
      });
      let mailOptions = {
        from: '"Swap-It 👻" ghpower409@gmail.com', // address email emettrice
        to: user.mail, // address email receptrice
        subject: "wellcome to Swap-It 👻 ✔", // Sujet 
        html: `<h1>Bonjour  ${user.prenom} </h1><br/>
        <h4>Le mot de passe du compte  ${user.username} a bien été reinitialiser</h4>`,
         
      };
      smtpTransport.sendMail(mailOptions, (err)=>{
        res.json({message: 'message recu !!!'});
        done(err);
      });
    }
  ], function(err){
    if(err){
      return next(err);
    }

  });
});

// suppression des produits
router.delete("/users/:id", (req, res, next) => {
  if (!ObjetId.isValid(req.params.id))
    return res.status(400).send(`id incorrecte ${req.params.id}`);
  User.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(
        "erreur lors de la suppression du produit:" +
          JSON.stringify(err, undefined, 2)
      );
    }
  });
});

/*******************************************************************************************************
 * *****   ******   gestion des requête de recherches et d'ajout d'amis *****  ****
*/

// Recherche utilisateurs enregistrer 

router.get('/:nom', function(req, res) {
  
  User.findOne({nom : req.params.nom}, {username:1, nom :1 ,  age:1 , genre :1, preferences:1 , presentation:1} , function(err, user) {
    if (!user) {
      res.json({message: "Couldn't find a user by that name"});
      return;
    } 
    res.json(user);
  });
});

// Ajout utilisateur 

router.post('/:nom', (req, res, next)=>{
  async.waterfall([
    function(done){
      User.findOne({nom:req.params.nom},{amis:1}, (err, user)=>{
        console.log(req.params.nom);
        if(!user){
          res.status(400).json({message : {msgBody : "utilisateur non trouvé .", msgError:true}});
        }
         
        
        /*if(amis){
          res.status(400).json({message : {msgBody : "utilisateur déjas amis .", msgError:true}});
        }*/
        
        
        user.amis.push( req.body.amis);
        console.log(req.body.amis);
        //user.amis.acceptBy = req.body.amis.acceptBy;
        //user.amis.notifs = Date.now();
        
        user.save((err)=>{
          done(err, user);
        });
      });
    },
    
    function( user, done){
      var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user:details.mail, // generated ethereal user
          pass: details.password // generated ethereal password
        },
      });
      let mailOptions = {
        from: '"Swap-It 👻" ghpower409@gmail.com', // address email emettrice
        to: user.mail, // address email receptrice
        subject: "wellcome to Swap-It 👻 ✔", // Sujet 
        html: `<h1>Bonjour  ${user.username} </h1><br/>
        <h4>L'utilisateur ${req.body.amis} souhaite vous ajouter à ça liste d'amis </h4>`,
         
      };
      smtpTransport.sendMail(mailOptions, (err)=>{
        res.json({message: 'message recu !!!'});
        done(err);
      });
    }

  ], function(err){
    if(err){
      return next(err);
    }

  });
});

/*router.post('/amis', (req, res, next)=>{
  
  const ami = new Amis({
    sendBy : req.body.sendBy,
    acceptBy: req.body.acceptBy
  });

  if(!req.body.sendBy){
  res.json({ success: false, message: 'sendBy is required.' });
  }else{
    ami.save((err, doc)=>{
      if(!err){
        return  res.send(doc);
      }else{
        console.log(
          " fichier introuvable et/ou erreur lors de l'enregistrement du fichier:" +
          JSON.stringify(err, undefined, 2)
        );
      }
      
    });  

  }
    
});*/

module.exports = router;