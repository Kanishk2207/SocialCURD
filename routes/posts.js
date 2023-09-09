const router = require("express").Router()
const Post = require("../models/posts")
const User = require("../models/user")
//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const post = await newPost.save()
        res.status(200).json("post is created")
    } catch (err) {
        res.status(err)
    }
})
//update a post
router.put("/:id", async (req, res) => {
    try {
    const thisPost = await Post.findById(req.params.id)

    if (thisPost.userId === req.body.userId) {
            await thisPost.updateOne({
                $set: req.body
            })
            res.status(200).json("post updated")

        }
        else {
            res.status(403).json("you can only update your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const thisPost = await Post.findById(req.params.id)
        if (thisPost.userId == req.body.userId) {
            await thisPost.deleteOne()
            res.status(200).json("post has been deleted")
        }
        else {
            res.status(403).json("you can only delete your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
//like a post
router.put("/:id/like", async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: { likes: req.body.userId }
            })

            res.status(200).json("you have liked the post")
        }
        else {
            await post.updateOne({
                $pull: { likes: req.body.userId }
            })

            res.status(200).json("you have unliked the post")

        }

    } catch (err) {
        res.status(500).json(err)
    }
})
//get a post
router.get("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)

    } catch (err) {
        res.status(500).json(err)
    }
})
//get timeline post
router.get("/timeline/all", async (req,res)=>{
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPost = await Post.find({userId : currentUser._id})
        const friendPost = await Promise.all(
            currentUser.following.map((friendId)=>{
                return Post.find({userId: friendId})
            })
            )
            res.status(200).json(userPost.concat(...friendPost))
    } catch (err) {
        res.status(500).json(err)
    }
})



module.exports = router