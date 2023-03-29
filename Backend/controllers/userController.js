const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require("cloudinary").v2;

const followAndUnfollowUserController = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;

    const currUserID = req._id;

    const userToFollow = await User.findById(userIdToFollow);
    const currUser = await User.findById(currUserID);

    if (currUserID === userIdToFollow) {
      return res.send(error(409, "User not follow themselves"));
    }

    if (!userToFollow) {
      return res.send(error(404, "User to Follow not Found"));
    }

    if (currUser.followings.includes(userIdToFollow)) {
      //already to followed --> then user gets unfollowed

      const followingIndex = currUser.followings.indexOf(userIdToFollow);
      currUser.followings.splice(followingIndex, 1);

      const followerIndex = userToFollow.followers.indexOf(currUser);
      userToFollow.followers.splice(followerIndex, 1);

      await userToFollow.save();
      await currUser.save();

      // return res.send(success(200, "User Unfollowed"));
    } else {
      //already to unfollowed --> then users get followed
      userToFollow.followers.push(currUserID);

      currUser.followings.push(userIdToFollow);

      await userToFollow.save();
      await currUser.save();

      // return res.send(success(200, "User followed"));
    }

    return res.send(success(200, { user: userToFollow }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getPostsOfFollowingController = async (req, res) => {
  try {
    const currUserId = req._id;

    const currUser = await User.findById(currUserId).populate("followings");

    const fullPosts = await Post.find({
      owner: {
        $in: currUser.followings,
      },
    }).populate("owner");

    const posts = fullPosts
      .map((item) => mapPostOutput(item, req._id))
      .reverse();
    // console.log("posts here", posts);
    // currUser.posts = posts;
    const followingsIds = currUser.followings.map((item) => item._id);
    // followingsIds.push(req._id);
    const suggestions = await User.find({
      _id: {
        $in: followingsIds,
      },
    });

    return res.send(success(200, { ...currUser._doc, suggestions, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyPostsController = async (req, res) => {
  try {
    const currUserID = req._id;

    const allUserPosts = await Post.find({ owner: currUserID }).populate(
      "likes"
    );

    return res.send(success(200, { allUserPosts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserPostsController = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.send(error(400, "User Id is Required"));
    }

    const allUserPosts = await Post.find({ owner: userId }).populate("likes");

    return res.send(success(200, { allUserPosts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteMyProfileController = async (req, res) => {
  try {
    const currUserId = req._id;

    const currUser = await User.findById(currUserId);

    //delete all posts
    await Post.deleteMany({
      owner: currUserId,
    });

    //remove myself from all my follower's following
    currUser.followers.forEach(async (followerId) => {
      const follower = await User.findById(followerId);

      const index = follower.followings.indexOf(currUserId);

      follower.followings.splice(index, 1);

      await follower.save();
    });

    //remove myself from my following's followers
    currUser.followings.forEach(async (followingId) => {
      const following = await User.findById(followingId);

      const index = following.followers.indexOf(currUserId);

      following.followers.splice(index, 1);

      await following.save();
    });

    //remove myself from all likes
    const allPosts = await Post.find();
    allPosts.forEach(async (post) => {
      const index = post.likes.indexOf(currUserId);

      post.likes.splice(index, 1);

      await post.save();
    });

    //delete the user
    await currUser.remove();

    //delete the user cookie
    res.clearCookie("Refresh_Token", {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, "User profile deleted Succesfully"));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("ye userId", userId);
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });

    console.log("user milgya", user);

    const FullPosts = user.posts;
    const posts = FullPosts.map((item) =>
      mapPostOutput(item, req._id)
    ).reverse();

    return res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    console.log("backend controller update Profile");
    const { name, bio, userImg } = req.body;
    console.log("request  body name", name);
    // console.log("request bodyimg", myBigImg);

    const user = await User.findById(req._id);

    if (name) {
      user.name = name;
    }

    if (bio) {
      user.bio = bio;
    }

    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImage",
      });
      console.log("ye cloudinary url", cloudImg.secure_url);
      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }

    await user.save();
    return res.send(success(200, { user }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getMyInfoController = async (req, res) => {
  try {
    const user = await User.findById(req._id);

    res.send(success(200, { user }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

module.exports = {
  followAndUnfollowUserController,
  getPostsOfFollowingController,
  getMyPostsController,
  getUserPostsController,
  deleteMyProfileController,
  getMyInfoController,
  updateUserProfileController,
  getUserProfileController,
  // deleteMyProfile   try to make this
};
