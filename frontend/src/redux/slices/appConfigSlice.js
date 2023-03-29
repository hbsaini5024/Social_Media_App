import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

//Redux Thunk
export const getMyInfo = createAsyncThunk("user/getMyInfo", async (_) => {
  try {
    //we can dispatch other actions using thunkAPi

    const response = await axiosClient.get("/user/getMyInfo");
    console.log("api data called", response);
    return response.data.result;
  } catch (e) {
    return Promise.reject(e);
  }
});

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body) => {
    try {
      //we can dispatch other actions using thunkAPi

      console.log("yeh meri body", body);

      const response = await axiosClient.put("/user/", body);
      console.log("api data called", response);
      return response.data.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    myProfile: null,
    toastData: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      });
  },
});

export default appConfigSlice.reducer;

export const { setLoading, showToast } = appConfigSlice.actions;
