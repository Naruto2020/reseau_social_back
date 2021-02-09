const mongoose = require("mongoose");
const { Schema } = mongoose;


var Poste = mongoose.model("Poste", {
    postId:{
        type:String,
        required:true
    },
    message : 
    {
        type:String,
        trim:true,
        maxlength:500,
    },
    picture:{
        type:String
    },
    video:{
        type:String
    },
    likers:{
        type:[String],
        required:true
    },
    /*likes:{
        type:[String],
        required:true
    },*/
    comments:{
        type:[
            {
                commenterId:String,
                commenterPseudo:String,
                text:String,
                timestamp: Number
            }
        ],
        required:true,
        
    },
    
    //mycomments : [{body : String, date:Date}],
    //friendcomments : [{body : String, date:Date}],
    loadBy: {
        type : String,
        required:true
    }, 
    date: { type: Date, default: Date.now },
});

module.exports = { Poste };