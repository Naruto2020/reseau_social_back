const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;


const UserSchema = new Schema({
    nom : {
        type: String,
        required: 'le champ nom doit etre remplit',
        minlength : [2,'le champ nom doit avoir au moins 2 caractères']
    },
    prenom : {
        type: String,
        required: 'le champ prénom doit etre remplit',
        minlength : [2,'le champ prénom doit avoir au moins 2 caractères']
    },
    username : {
        type:String,
        required: 'le champ pseudo doit etre remplit',
        minlength : [2,'le champ pseudo doit avoir au moins 2 caractères'],
        unique: true
    },
    password : {
        type: String,
        required: 'le champ mot de passe doit etre remplit',
        minlength : [8,'le champ mdp doit avoir au moins 4 caractères'],

    },
    genre : {
        type: String,
    },
    mail : {
        type: String,
        required: 'le champ mail doit etre remplit',
        index : {
            unique:true,
        },
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    age : {
        type : Number,
        
    },
    coordonnees : {
        type : Number,
        //required: 'le champ coordonnees doit etre remplit',
    },

    presentation : {
        type: String
        //required: 'le champ presentation doit etre remplit',
    },
    preferences : {
        type: String,
    },
    niveau:{
        type:String,
        required : 'vous devez sélectioner admin ou user ou visit',
        enum : ["admin", "user", "visit" ]    
        
    },
    amis:[],
       
        /*sendBy : { type: String}  ,
        acceptBy : {type:String} ,
        notifs : Date*/
              
    reset: String,

    resetExpires: Date

});

UserSchema.pre("save", function(next){  
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) 
        return next();
        
    // hash the password along with our new salt
    bcrypt.hash(this.password, SALT_WORK_FACTOR, (err, passwordHash)=> {
        if (err) 
            return next(err);
            
        // override the cleartext password with the hashed one
        this.password = passwordHash;
        //console.log(this.password);
        
         next();
        });  
    });
    
    UserSchema.methods.comparePassword = function(password, cb) {
        
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err){
                return cb(err);
            }else{
                if(!isMatch)
                   return cb(null, isMatch);
                return cb(null, this);   
            } 
            
        });
    };
    
    
var User =  mongoose.model("User", UserSchema);
module.exports = { User };