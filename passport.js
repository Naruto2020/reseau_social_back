const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { User } = require("./modele/comptes.js");

const cookieExtractors = req =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
}

// Autorisation de connexion 
passport.use(new JwtStrategy(
    {
        jwtFromRequest: cookieExtractors,
        secretOrKey : "OngolaKne"
    }, 
    (payload,done)=>{
        User.findById({_id : payload.sub}, (err, user)=>{
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user);   
            }else{

                return done(null, false);   
            }

        });
                      
    
}));

// authentification local avec l'email et le mdp
passport.use(new LocalStrategy(
    (username, password, done)=>{
        User.findOne({ username:username },(err, user)=>{
           // en cas de soucis avec la BDD
           if(err){
            return done(err);
           }
           // si le profil n'existe pas 
           if (!user){
            return done(null, false);
           }
           user.comparePassword(password,done);

        });


}));

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

    