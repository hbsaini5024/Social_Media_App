// import { configueStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import appConfigSlice from "./slices/appConfigSlice";
import feedSlice from "./slices/feedSlice";
import postsSlice from "./slices/postsSlice";

export default configureStore({
  reducer: {
    appConfigReducer: appConfigSlice,
    postsReducer: postsSlice,
    feedReducer: feedSlice,
  },
});
