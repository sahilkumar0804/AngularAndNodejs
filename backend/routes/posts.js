const express =require('express');
const multer =require('multer');

const Post = require('../models/post');
const checkAuth= require("../middleware/check-auth");

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

router.post("",
checkAuth,
multer({storage : storage}).single('image'),
(req,res)=>{
  const url =req.protocol +'://'+ req.get("host");
  const post =new Post({
    title : req.body.title,
    content :req.body.content,
    imagePath : url + '/images/'+ req.file.filename,
    creator: req.userData.userId
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

router.get('',(req,res)=>{
  const pageSize =+(req.query.pageSize);
  const currentPage =+req.query.page;
  const postQuery= Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage - 1 ))
    .limit(pageSize);
  }
  postQuery
  .then(document=>{
    fetchedPosts=document;
     return Post.countDocuments();
    })
    .then(count=>{
    res.json({
      message: 'Posts fetched seccesfully',
      posts: fetchedPosts,
      maxPosts : count
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
checkAuth,
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
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({
    _id : req.params.id,
    creator: req.userData.userId
  },post)
  .then(result=>{
    if(result.nModified >0){
       res.json({message : 'Upade sucessfully!'});
    } else {
      res.status(401).json({ message: 'not authorized' });
    }
  });
});

router.delete("/:id",
checkAuth,
(req,res)=>{
  Post.deleteOne({_id :req.params.id, creator: req.userData.userId})
  .then(result=>{
    if(result.n >0){
      res.json("sucessfuly deleted");
   } else {
     res.status(401).json({ message: 'not authorized' });
   }

  });

});


module.exports = router;
