const mongoose =require("mongoose");

const postSchema =mongoose.Schema({
  title :String,
  content: String,
  imagePath: String,
  creator: {type: mongoose.Schema.Types.ObjectId, ref:"User" ,require : true}
});

module.exports= mongoose.model('Post',postSchema);
