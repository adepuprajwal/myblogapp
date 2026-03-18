const exp = require("express")
const userApp = exp.Router()
const createUserOrAuthor = require("./createUserOrAuthor");
const expressAsyncHandler = require('express-async-handler');
const Article = require("../models/articleModel");
userApp.use(exp.json())
// API
userApp.post('/user',expressAsyncHandler(createUserOrAuthor));

// Add comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    // get comment obj
    const commentObj = req.body ;
    //add commentObj to comments array of article
    const articleWithComments=await Article.findOneAndUpdate(
        {articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false}
    )
    res.send({message:"comment added",payload:articleWithComments})

}))

module.exports=userApp;