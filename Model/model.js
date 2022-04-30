const mongoose = require("mongoose")

//create a user Schema for data base
const userSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Email: {type: String, required: true, unique: true},
    Password: {type: String, required: true}
}, {timestamps: true})

//declare user model and collection name in database
const userModel = mongoose.model("Users", userSchema)

module.exports = userModel