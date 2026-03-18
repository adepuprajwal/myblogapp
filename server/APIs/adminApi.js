const exp = require("express")
const adminApp = exp.Router();

// API
adminApp.get("/",(req,res)=>{
    res.send({message:"from admin API"})
})

module.exports=adminApp;