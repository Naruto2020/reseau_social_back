const mongoose = require("mongoose");
const { Schema } = mongoose;

var ImageSchema = new Schema ({
    //uts : [{type:Schema.Types.ObjectId, ref: "User"}],
   photo : {
      type : String, 
      required:"vous devez sélectionner une photo"
   },
   loadBy: {
      type : String
   }
   
});
var Image = mongoose.model('Image', ImageSchema);
module.exports = { Image };