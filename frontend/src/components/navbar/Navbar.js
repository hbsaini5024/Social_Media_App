import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import "./Navbar.scss";

import { AiOutlineLogout } from "react-icons/ai";
import { useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";

function Navbar() {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  console.log("data of my profile", myProfile);

  async function handleLogout() {
    try {
      await axiosClient.post("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="Navbar">
      <div className="container">
        <h2 className="banner hover-link" onClick={() => navigate("/")}>
          Social Media
        </h2>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => navigate(`/profile/${myProfile?._id}`)}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link" onClick={handleLogout}>
            <AiOutlineLogout className="logout-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;


