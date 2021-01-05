// initialisation du routeur express
const express = require("express");
const router = express.Router();

// import de l'objetId de mongoose
const ObjetId = require("mongoose").Types.ObjectId;
// import de l'objet modele Comptes
//const { Profil } = require("../modele/comptes.js");
const { Image} = require("../modele/images.js");
const { User} = require("../modele/comptes.js");

// gestion des téléchargements d'images avec le module multer 
const multer = require("multer");
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

//const CORS = require("cors");
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  router.get('/:nom', function(req, res) {
  
    User.findOne({nom : req.params.nom } , function(err, user) {
      if (!user) {
        res.json({message: "Couldn't find a user by that name"});
        return;
      } 
      res.json(user);
    });
  });


  // routage
// pour afficher la liste d'ut amis
router.get("/", (req, res)=>{
    Profil.find((err, docs)=>{
        if(!err){
         return  res.send(docs);
        }else{
            console.log("erreur de transmission de la liste des comptes:" + JSON.stringify(err, undefined, 2));
        }
    });
    //next();
    
});

// pour afficher un ut avec son ID 
router.get("/:id", (req, res)=>{
    // verrification de la validité de l'ID
    if(!ObjetId.isValid(req.params.id))
      return res.status(400).send(`Id incorrecte ${req.params.id}`)
    Profil.findById(req.params.id, (err, doc)=>{
        if(!err){
            res.send(doc);
        }else{
            console.log("erreur de transmission du comptes utilisateur:" + JSON.stringify(err, undefined, 2));
            
        }
    }); 
    

});



// ajout de la photo d'un utilisateur 
router.post("/", upload.single("photo"), (req, res)=>{
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
          photo : req.file.path
        });
        console.log("voici l'image : ", img.photo);
        
        img.save((err, doc)=>{
          console.log(img);
          if(!err){
            return  res.send(doc);
          }else{
              console.log(
                  "erreur lors de l'enregistrement du profil:" +
                    JSON.stringify(err, undefined, 2)
                );
          }
      });


});   

   // maj des données
   router.put("/:id", upload.single("photo") , (req, res, next) => {
    if (!ObjetId.isValid(req.params.id))
      return res.status(400).send(`id incorrecte ${req.params.id}`);
      const file = req.file;
      console.log(file.filename);
  
    var img = {
        photo : req.file.path,

    };
    Liste.findByIdAndUpdate(
      req.params.id,
      { $set: img },
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
});
        
        