const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require("cloudinary").v2;

const createPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body;

    if (!caption) {
      res.send(error(400, "Caption is required"));
    }

    if (postImg) {
      const cloudImg = await cloudinary.uploader.upload(postImg, {
        folder: "postImg",
      });
    }

    const owner = req._id;

    const user = await User.findById(req._id);

    const post = await Post.create({
      owner,
      caption,
      // image: {
      //   publicId: cloudImg.public_id,
      //   url: cloudImg.url,
      // },
    });

    user.posts.push(post._id);
    await user.save();
    console.log(post);
    // res.setHeader("content-type", "image/png");
    return res.send(success(201, post));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const likeAndUnlikePostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const currentUserId = req._id;

    const post = await Post.findById(postId).populate("owner");

    if (!post) {
      return res.send(error(404, "Post Not Found"));
    }

    if (post.likes.includes(currentUserId)) {
      const index = post.likes.indexOf(currentUserId);
      post.likes.splice(index, 1);

      // await post.save();
      // return res.send(success(200, "Post Unliked"));
    } else {
      post.likes.push(currentUserId);

      // await post.save();
      // return res.send(success(200, "Post Liked"));
    }

    await post.save();
    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const currUserID = req._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.send(error(404, "Post not Found"));
    }

    //you can update post of ourself not others
    if (post.owner.toString() !== currUserID) {
      return res.send(error(403, "Only Owners can update their posts"));
    }

    if (caption) {
      post.caption = caption;
      await post.save();
    }

    return res.send(success(200, { post }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deletePostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const currUserID = req._id;

    const post = await Post.findById(postId);
    const currUser = await User.findById(currUserID);

    if (!post) {
      return res.send(error(404, "Post not Found"));
    }

    //you can delete post of ourself not others
    if (post.owner.toString() !== currUserID) {
      return res.send(error(403, "Only Owners can delete their posts"));
    }

    const index = currUser.posts.indexOf(postId);
    //delete the post using splice method of array
    currUser.posts.splice(index, 1);

    await currUser.save();
    await post.remove();

    return res.send(success(200, "Post delete Succesfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createPostController,
  likeAndUnlikePostController,
  updatePostController,
  deletePostController,
};
