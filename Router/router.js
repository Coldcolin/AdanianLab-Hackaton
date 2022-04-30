const express = require("express")
const router = express.Router()
const userModel = require("../Model/model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const EventEmitter = require('events');


//1. Build a register endpoint and create userId and encrypt password
router.post("/register", async(req, res)=>{
    try{
        const hSalt = await bcrypt.genSalt(10);
        const hPassword = await bcrypt.hash(req.body.Password, hSalt);
        const newUser = await userModel.create({
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hPassword
        });
        res.status(200).json({message: "new User Created",data: newUser});
    }catch(error){
        res.status(400).json({message: error.message})
    };
});

//2. Login with email and password
router.post("/login", async(req, res)=>{
    try{
        //check if email exist, if not return email not exist
        const signed = await userModel.findOne({Email: req.body.Email});
        if(signed){
            //check if password is correct
            const check = await bcrypt.compare(req.body.Password, signed.Password);
            if(check){
                const {Password, ...data} = signed._doc
                //return jwt token on login successful
                const token = jwt.sign({
                    id: signed._id,
                    Name: signed.Name,
                    Email: signed.Email
                }, "IamAWorLdWideWEBDEveloper", {expiresIn: "1d"});
                res.status(200).json({message: `welcome back ${signed.Name}`, data: {...data, token}});
            }else{
                res.status(400).json({message: "Password incorrect"});
            }
        }else{
            res.status(404).json({message: "email not exist"});
        }
    }catch(error){
        res.status(401).json({message: error.message});
    }
})


//to verify if user is signed in
const verification = (req, res, next)=>{
    const authCheck = req.headers.authorization
    try{
        if(authCheck){
            const token = authCheck.split(" ")[1]
            jwt.verify(token, "IamAWorLdWideWEBDEveloper", (err, payload)=>{
                if(err){
                    res.status(400).json({message: "Please Check your token"})
                }
                req.user = payload
                next()
            })
        }
    }catch(err){
        res.status(400).json({message: "You are not authorized for this operation"})
    }
}

//3. get all users
router.get("/allUsers/:id", verification, async(req, res)=>{
    try{
        if(req.user){
            const id = req.params.id
            const notID = !id
            const currentUser = await userModel.findById(id)
            const users = await userModel.find().where("_id").equals(`${id}`)
            const user = await userModel.find()
            if(currentUser){
                res.status(200).json({data: user})
            }else{
                res.status(400).json({message: "Please Login first"})
            }
        }else {
            res.status(400).json({message: "check user"})
        }
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

//4.get Profile
router.get("/User/:id", async(req, res)=>{
    try{
        const id = req.params.id
        const currentUser = await userModel.findById(id)
        
        res.status(200).json({data: currentUser})
    }catch(error){
        res.status(400).json({message: error.message})
    }
})



module.exports = router