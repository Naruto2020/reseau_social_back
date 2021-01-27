const mongoose = require("mongoose");
const { Schema } = mongoose;


var Poste = mongoose.model("Poste", {
    message : {type:String},
    commentaires : [{body : String, date:Date}],
    loadBy: {
        type : String
    }, 
    date: { type: Date, default: Date.now },
});

module.exports = { Poste };