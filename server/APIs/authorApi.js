const exp = require("express")
const authorApp = exp.Router();
const createUserOrAuthor = require('./createUserOrAuthor');
const expressAsyncHandler = require('express-async-handler');
const Article = require("../models/articleModel");

const {requireAuth}=require('@clerk/express')
require('dotenv').config();
// authorApp.use(clerkMiddleware);
// API

authorApp.use(exp.json());
authorApp.post('/author',expressAsyncHandler(createUserOrAuthor));

authorApp.post("/article",expressAsyncHandler(async(req,res)=>{

    // get new article obj from req
    const newArticleObj=req.body ;
    const newArticle = new Article(newArticleObj);
    let newArticleDoc = await newArticle.save();
    res.status(201).send({message:"Article published",payload:newArticleDoc})

}))

authorApp.get('/articles',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    // read all articles from db which are not softly deleted
    const listOfArticles = await Article.find({isArticleActive:true});
    res.status(200).send({message:"articles",payload:listOfArticles})
}))

authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:'unauthorized login, please login'})
})

authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{

    // get modified article
    const modifiedArticle = req.body ;
    // Update article by article Id
    const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
        {...modifiedArticle},
        {returnOriginal:false});
    // send res
    res.status(200).send({message:"article modified",payload:latestArticle})
    
}))

// Soft delete the Article by changing the active  status
authorApp.put('/articles/:articleId',expressAsyncHandler(async(req,res)=>{

    // get modified article
    const modifiedArticle = req.body ;
    // Update article by article Id
    const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
        {...modifiedArticle},
        {returnOriginal:false});
    // send res
    res.status(200).send({message:"article deleted or restored",payload:latestArticle})
}))

module.exports=authorApp;