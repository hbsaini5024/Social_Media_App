import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../redux/slices/feedSlice";
import Follower from "../follower/Follower";
import Post from "../post/Post";
import "./Feed.scss";

function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feedReducer.feedData);

  console.log(feedData);
  useEffect(() => {
    dispatch(getFeedData());
    console.log("hello harsh");
  }, []);

  return (
    <div className="Feed">
      <div className="container">
        <div className="left-part">
          {/* <Post />
          <Post />
          <Post />
          <Post /> */}
          {feedData.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="following">
            <h3 className="title">You are Following</h3>
            {/* <Follower />
            <Follower />
            <Follower />
            <Follower /> */}
            {feedData.followings?.map((user) => (
              <Follower user={user} key={user._id} />
            ))}
          </div>
          <div className="suggestions">
            <h3 className="title">Suggestions for you</h3>
            {/* <Follower />
            <Follower />
            <Follower />
            <Follower /> */}
            {feedData.suggestions?.map((user) => (
              <Follower user={user} key={user._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
