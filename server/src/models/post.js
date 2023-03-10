
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 1
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

PostSchema.virtual('url').get(function (){
    return `/api/posts/${this._id}`;
})

module.exports = mongoose.model('Post', PostSchema);