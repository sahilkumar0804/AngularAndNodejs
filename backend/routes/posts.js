const express =require('express');
const multer =require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP ={
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage= multer.diskStorage({
  destination: (req, file, callback)=>{
    const isValid =MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mine type");
    if(isValid){
      error =null;
    }
    callback(error, "backend/images");

  } ,
  filename: (req,file ,callback)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext =MIME_TYPE_MAP[file.mimetype];

    callback(null, name+'-'+Date.now()+'.'+ ext);
  }
});

router.post("",multer({storage : storage}).single('image'),(req,res)=>{
  const url =req.protocol +'://'+ req.get("host");
  const post =new Post({
    title : req.body.title,
    content :req.body.content,
    imagePath : url + '/images/'+ req.file.filename
  });
  post.save()
  .then(resut=>{
    res.status(201).json({
      message :'Post added sucessfully',
      post :{
        ...resut,
        id: resut._id,
      }
    });

  });
});

router.get('',(req,res,next)=>{
  Post.find()
  .then(document=>{
    res.json({
      message: 'Posts fetched seccesfully',
      posts: document
    });
  })
  .catch(err=>{
    console.error(err);
  });

});

router.get("/:id",(req,res)=>{
  Post.findById({_id : req.params.id})
  .then(post=>{
    if(post){
      res.json(post);
    } else {
      res.json({message : 'Post not found'});
    }
  });
})

router.put("/:id",
multer({storage : storage}).single('image'),
(req,res)=>{
  let imagePath =req.body.imagePath;
  if(req.file) {
    const url =req.protocol +'://'+ req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id : req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id : req.params.id},post)
  .then(result=>{
    res.json({message : 'Upade sucessfully!'});
  });
});

router.delete("/:id",(req,res)=>{
  Post.deleteOne({_id :req.params.id})
  .then(result=>{
    console.log("posts delted");
    res.json("sucessfuly deleted");
  });

});


module.exports = router;
