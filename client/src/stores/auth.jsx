import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: false,
  onlineUser: [],
  socketConnection: null,
  token: localStorage.getItem("token") || false,
};

export const setSocketConnectionStatus = (status) => ({
  type: "auth/setSocketConnectionStatus",
  payload: status,
});

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    deleteUser: (state) => {
      state.user = false;
      state.socketConnection = null;
      localStorage.removeItem("token");
      state.token = false;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const { setUser, deleteUser, setOnlineUser, setSocketConnection, setToken } = auth.actions;
export default auth.reducer;
