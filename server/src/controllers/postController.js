const Post = require('../models/post')
const Comment = require('../models/comment')
const async = require('async')

//Get request for both published and unpublished posts `Accessible to only admin`
exports.posts_get = async (req, res, next) => {
    const posts = await Post.find({}, 'title').exec();
    if(!posts){
        res.status(500).json({message: 'Server Error'});
        next(err);
    }
    return res.status(200).json({posts});
}

//Get requests for published posts `Accessible to anyone`
exports.published_posts_get = async (req, res, next) => {
    const posts = await Post.find({'published': true}, 'title').exec();
    if(!posts){
        res.status(500).json({message: 'Server Error'});
        next(err);
    }
    return res.status(200).json({posts});
}

exports.post_get = (req, res, next) =>{
    async.parallel(
    {
        post(){
            Post.findById(req.params.id)
                .exec();
        },
        post_comments(){
            Comment.find({post: req.params.id})
                .sort({createdAt: -1})
                .exec();
        }   
    },
    (err, results) =>{
        if(err){
            return next(err);
        }
        if(results.post === null){
           const err = new Error('Post not found');
           err.status(404);
           return next(err);
        }
        return res.status(200).json({
            post: results.post,
            comments: results.post_comments
        })
    }
)
}

exports.comment_add_post = (req, res, next) =>{
    const {content, commenter} = req.body;

    if(!content || !commenter){
        return res.status(400).json({message: 'Incomplete request'});
    }
    const comment = new Comment({content: content,
                                post: req.params.id,
                                commenter: commenter
                            });
    comment.save().then((err, savedComment) => {
        if(err){
            next(err);
        }
        return res.status(200).json({savedComment});
    })
}


exports.update_post_put = async (req, res, next) =>{
    const {title, body, published} = req.body;
    
    const post = await Post.findById(req.params.id);

    if(!post){
         res.status(404).json({message: 'Post not found'})
         next();
    }

    if(!published){
        published = post.published;
    }

    if(!title){
        title = post.title;
    }
    
    if(!body){
        body = post.body;
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        title,
        body,
        published
    }).exec();

    if(!updatedPost){
        res.status(500).json({message: 'Server error'});
        next();
    }

    return res.status(200).json({updatePost});
}