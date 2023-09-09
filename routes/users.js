const router = require("express").Router()
const User = require("../models/user")
const bycrypt = require("bcrypt")

//update
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bycrypt.genSalt(10)
                req.body.password = await bycrypt.hash(req.body.password, salt)
            } catch (err) {
                res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("user update successful")
        } catch (err) {

        }

    } else {
        res.status(403).json("you can only update your account")

    }
})

//delete
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("user removed")
        } catch (err) {
            res.status(404).json("user not found")
        }
    }
    else {
        res.status(403).json("only user can delete the account")
    }
})
//get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.body.userId)
        const { password, updatedAt, email, createdAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(404).json("user not found")
    }
})
//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.params.id !== req.body.userId) {
        try {

            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)

            if (!user.followers.includes(req.body.userId)) {

                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { following: req.params.id } })

                res.status(200).json("you are now following the user")

            }
            else {
                res.status(403).json("you already follow the user")
            }
        }
        catch (err) {
            res.status(500).json(err)
        }

    }
    else {
        res.status(403).json("you cannot follow yourself")
    }
})
//unfollow a user

router.put("/:id/unfollow", async(req,res)=>{
    if (req.body.userId !== req.params.id) {
        try {
            
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers:req.body.userId}})
                await currentUser.updateOne({$pull: {following:req.params.id}})

                res.status(200).json("you unfollowed the user")
            } else {
                res.status(403).json("you do not follow this user")
            }

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("you cannot unfollow yourself")
    }
})



module.exports = router

