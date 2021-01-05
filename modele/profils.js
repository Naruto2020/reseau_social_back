const mongoose = require("mongoose");
const { Schema } = mongoose;

var ImagePro = mongoose.model("ImagePro", {
    //uts : [{type:Schema.Types.ObjectId, ref: "User"}],
    //imgBack: [{type:Schema.Types.ObjectId, ref: "Images"}],
    photo : {
       type : String,
       required:"vous devez sélectionner une photo"
    },
    loadBy: {
        type : String
    }
});
module.exports = { ImagePro };