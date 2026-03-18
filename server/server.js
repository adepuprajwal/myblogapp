const exp = require("express")
const app=exp();
require('dotenv').config();//process.env
const cors = require('cors')
app.use(cors())
// PORT number from .env file comes here:
const port = process.env.PORT || 4000 ; // if process.env.PORT is not available, then 4000 is used

const mongoose = require("mongoose");
const userApp = require("./APIs/userApi");
const authorApp = require("./APIs/authorApi");
const adminApp = require("./APIs/adminApi");

// DB connection
mongoose.connect(process.env.DBURL)
.then(()=>{
    console.log("Database connected successfully");
    // Start HTTP server
    app.listen(port,()=>console.log(`server is listening on port ${port}`))
}).catch(err=>{
    console.log("An error occured:",err)
})

app.use((err,req,res,next)=>{
    console.log("Err obj in express error handler",err);
    res.send({message:"error occured",payload:err.message});
})

app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)
