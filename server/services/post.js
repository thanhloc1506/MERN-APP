const post = require('../model/Post');

const createPost = async (title, description, url, status, userId) => {
    return await post.create({
        title: title,
        description: description,
        url: url.startsWith('https://') ? url : `https://${url}`,
        status: status || 'TO LEARN',
        user: userId
    })
}

const getAllPost = async (userID) => {
    // populate choose to table user and pick atr username ....
    return await post.find({user: userID}).populate('user', ['username'])
}

const updatePost = async (postObj, updateCondition) => {
    return await post.findOneAndUpdate(updateCondition, postObj, {new: true})
}

const deletePost = async (deleteCondition) => {
    return await post.findOneAndDelete(deleteCondition)
}

module.exports = {
    createPost,
    getAllPost,
    updatePost,
    deletePost
}