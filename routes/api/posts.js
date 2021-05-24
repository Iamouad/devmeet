const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const {body, validationResult} = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { json } = require('express');

// @route GET api/posts
// Get all posts
// @access Private
router.get('/',auth , async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});

// @route GET api/posts/:post_id
// Get post by id
// @access Private
router.get('/:post_id',auth , async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        res.json(post);
    } catch (error) {
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }
        console.log(error);
        return res.status(500).send('Server Error');
    }
});

// @route POST api/posts
// Create a post
// @access Private

router.post('/', [
    auth,
    [
        body('text', 'Post must not be empty').notEmpty()
    ]
],
    async(req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                text: req.body.text,
                user: req.user.id,
                name: user.name,
                avatar: user.avatar
            });
            
            await newPost.save();
            res.json(newPost);

        } catch (error) {
            console.log(error);
            return res.status(500).send('Server Error');
        }

    });

// @route Delete api/posts/:post_id
// delete post by id
// @access Private
router.delete('/:post_id',auth , async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.post_id, user: req.user.id})
        if(!post){
            return res.status(401).json({msg: 'Cannot delete that post'});
        }
        await post.remove();
        res.json({msg: 'Post removed'});
    } catch (error) {
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }
        console.log(error);
        return res.status(500).send('Server Error');
    }
});

// @route Put api/posts/:post_id/:like
// like a post by id
// @access Private
router.put('/:post_id/like', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        //check if post already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'Post already liked'});
        }
        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});

// @route Delete api/posts/:post_id/:unlike
// unlike a post by id
// @access Private
router.delete('/:post_id/like', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        //check if post already liked
        const likeRemoved = {...post.likes.filter(like => like.user.toString() === req.user.id)[0]};
        if(Object.keys(likeRemoved).length === 0){
            return res.status(400).json({msg: 'Like not found'});
        }
        post.likes.splice(post.likes.indexOf(likeRemoved), 1);
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});

// @route Put api/posts/:post_id/comment
// comment a post by id
// @access Private
router.put('/:post_id/comment',[
    auth,
    [
        body('text', 'Text is required').notEmpty()
    ]
    ], 
    async (req, res) =>{
        const errors = validationResult(req);
        if(! errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
    try {
        
        const post = await Post.findById(req.params.post_id);
        const user = await User.findById(req.user.id);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        post.comments.unshift({
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        });
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});

// @route Delete api/posts/:post_id/:comment
// unlike a post by id
// @access Private
router.delete('/:post_id/comment/:comment_id', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        //check if post already liked
        const commentRemoved = {...post.comments.filter(comment => comment.user.toString() === req.user.id && comment._id.toString() === req.params.comment_id)[0]};
        if(Object.keys(commentRemoved).length === 0){
            return res.status(400).json({msg: 'comment not found'});
        }
        post.comments.splice(post.comments.indexOf(commentRemoved), 1);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
})



module.exports = router;