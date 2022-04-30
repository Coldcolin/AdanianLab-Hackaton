const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose")
const PORT = process.env.PORT;
//Mongodb URL link
const URL = process.env.URL
//Allow api accept json
app.use(express.json())

//connecting the router and control functionalities
app.use("/api", require("./Router/router"))

//connecting to database
mongoose.connect(URL, {useNewURLParser: true, useUnifiedTopology: true}).then(()=>{
    //Let server connect when database is accessed
    app.listen(PORT, ()=>{
        console.log(`listening to PORT ${PORT}`)
    })
    console.log(`connected to ${URL}`)
})

