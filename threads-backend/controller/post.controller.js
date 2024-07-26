import { Post } from "../models/post.model.js";
import User from "../models/user.model.js";

const createPost = async (req, res, next) => {
  try {
    const { postedBy, text, img } = req.body;
    if (!postedBy || !text) {
      return res.status(400).json({
        error: "Please fill the postedBy and text field",
      });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    const userId = req.user._id;
    if (userId.toString() !== postedBy) {
      return res.status(401).json({
        error: "You are not authorized for making this post",
      });
    }
    // text length validation
    const maxLenght = 500;
    if (text.length > maxLenght) {
      return res.status(400).json({
        error: `Text cannot be more than ${maxLenght} characters!`,
      });
    }
    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found!" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: "Post Not Found!",
      });
    }
    // one who posts, he only gets to delete
    // console.log(typeof req.user._id," ",req.user._id );//object   new ObjectId('66a38136d917d9f7ba53f218')
    // console.log(typeof post.postedBy," ",post.postedBy); //object   new ObjectId('66a38136d917d9f7ba53f218')
    // console.log(post.postedBy === req.user._id); // false

    // will return false unless they reference the same object in memory. 
    // In your case, both req.user._id and post.postedBy are ObjectId objects, 
    // and although they contain the same value, they are different instances of ObjectId.

    if (req.user._id.toString() !== post.postedBy.toString()) {
      return res.status(401).json({
        error: "Unauthorized Access! You cannot delete this Post",
      });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Post deleted sucessfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
export { createPost, getPost, deletePost };
