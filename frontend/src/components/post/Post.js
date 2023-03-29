import React from "react";
import Avatar from "../avatar/Avatar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "./Post.scss";
import backgroundImg from "../../assets/background.jpg";
import { useDispatch } from "react-redux";
import { likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

function Post({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handlePostLike() {
    dispatch(
      showToast({
        type: TOAST_SUCCESS,
        message: "Liked or Unliked",
      })
    );
    dispatch(
      likeAndUnlikePost({
        postId: post._id,
      })
    );
  }

  console.log("Post Component", post?.owner?.name);
  return (
    <div className="Post">
      <div
        className="heading"
        onClick={() => navigate(`/profile/${post.owner._id}`)}
      >
        <Avatar />
        <h4>{post?.owner?.name}</h4>
      </div>
      <div className="content">
        <img src={backgroundImg} alt="" />
      </div>
      <div className="footer">
        <div className="like" onClick={handlePostLike}>
          {post.isLiked ? (
            <AiFillHeart style={{ color: "red" }} className="icon" />
          ) : (
            <AiOutlineHeart className="icon" />
          )}
          {/* <AiOutlineHeart className="icon" /> */}
          <h4>{`${post?.likesCount} likes`}</h4>
        </div>
        <p className="caption">{post?.caption}</p>
        <h6 className="time-ago">{post?.timeAgo}</h6>
      </div>
    </div>
  );
}

export default Post;
