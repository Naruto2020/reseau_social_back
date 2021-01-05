const mongoose = require("mongoose");
const { Schema } = mongoose;

var Amis = mongoose.model("Amis", {
    //uts : [{type:Schema.Types.ObjectId, ref: "User"}],
 
    sendBy: {
      type : String
    },
    acceptBy:{
      type: String
    }
   // imgPro: [{type:Schema.Types.ObjectId, ref: "ImagePro"}],
});
module.exports = { Amis };