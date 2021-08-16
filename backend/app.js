const path = require('path');
const express = require('express');
const bodyParse =require('body-parser');
const mongoose =require('mongoose');

const app =express();

const postsRoutes = require("./routes/posts");

// const Post = require('./models/post');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extend :false}));
app.use("/images", express.static(path.join('backend/images')));

mongoose.connect("mongodb+srv://angularapp:"+process.env.Mongo_ATLAS_PW+"@cluster0.cs0jl.mongodb.net/node-angular?retryWrites=true&w=majority",{useNewUrlParser: true})
.then(()=>{
  console.log("Connected to database");
}).catch(()=>{
  console.log("Connecton failed");
});
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin",'*');
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods",
  "Get ,POST, PATCH, DELETE, OPTIONS ,PUT");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", require('./routes/user'));


module.exports = app;
