const bcrypt =require('bcrypt');
const jwt= require('jsonwebtoken');

const User = require('../models/user');


module.exports.createUser=(req,res)=>{
  bcrypt.hash(req.body.password, 10)
  .then(hash=>{
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user.save()
    .then(result=>{
      res.json({
        message: "User created!",
        result :result
      });
    })
    .catch(err=>{
      res.status(500).json({
            message: "Invaild authentication credentials!"
      } );
    });
  });
}

module.exports.userLogin=(req,res)=>{
  let fetchedUser;
  User.findOne({ email :req.body.email })
  .then(user=>{
    if(!user){
      return res.status(401).json({
        message: "Invalid Email"
      });
    }
    fetchedUser=user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result=>{
    if(!result){
      return res.status(401).json({
        message: "Password not matched!!"
    });
    }
    const token=jwt.sign({
      email: fetchedUser.email,
      userId: fetchedUser._id
     }, 'secret_this_should_be_longer',{
       expiresIn: "1h"
     });
     res.status(200).json({
       token : token,
       expiresIn: '3600',
       userId: fetchedUser._id
     });
  })
  .catch(err=>{
    return res.status(401).json({
      message: "Invaild authentication credentials!"
    });
   });
}
