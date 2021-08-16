const Post = require('../models/post');

exports.createPost=(req,res)=>{
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
  })
  .catch(error=>{
    res.status(500).json({
      message:"Creating a post failed!"
    });
  });
}

exports.updatePost =(req,res)=>{
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
    if(result.n >0){
       res.json({message : 'Upade sucessfully!'});
    } else {
      res.status(401).json({ message: 'not authorized' });
    }
  })
  .catch(error=>{
      res.status(500).json({
        message:"Couldn't update post!"
      });
  });
}

exports.getPosts =(req,res)=>{
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
    })
  }).
  catch(error=>{
    res.status(500).json({
      message:"Fetching psots faild!"
    });
  });

}

exports.getPost =(req,res)=>{
  Post.findById({_id : req.params.id})
  .then(post=>{
    if(post){
      res.json(post);
    } else {
      res.json({message : 'Post not found'});
    }
  }).
  catch(error=>{
    res.status(500).json({
      message:"Fetching psot faild!"
    });
  });
}


exports.deletePost =(req,res)=>{
  Post.deleteOne({_id :req.params.id, creator: req.userData.userId})
  .then(result=>{
    if(result.n >0){
      res.json("sucessfuly deleted");
   } else {
     res.status(401).json({ message: 'not authorized' });
   }

  }).
  catch(error=>{
    res.status(500).json({
      message:"Couldn't Delted post!"
    });
  });
}
