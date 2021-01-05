const mongoose = require("mongoose");
const { Schema } = mongoose;

var Image = mongoose.model("Image", {
    //uts : [{type:Schema.Types.ObjectId, ref: "User"}],
   photo : {
      type : String,
      required:"vous devez sélectionner une photo"
   },
   loadBy: {
      type : String
   }
   // imgPro: [{type:Schema.Types.ObjectId, ref: "ImagePro"}],
});
module.exports = { Image };