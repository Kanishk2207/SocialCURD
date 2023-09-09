const router = require("express").Router()
const User = require("../models/user")
const bycrypt = require("bcrypt")

//REGISTER 
router.post('/register', async (req, res) => {
    try {
        //generating new password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(req.body.password, salt)

        //crating new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        
        
        //saving user and respond
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
});


//LOGIN
router.post("/login",async(req,res)=>{
    try{
    const user = await User.findOne({email : req.body.email})
    !user && res.status(404).json("user not found")

    const validPassword = await bycrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("invalid password")


    res.status(200).json(user)

    }catch(err){
        res.status(500).json(err)
    }





})



module.exports = router

