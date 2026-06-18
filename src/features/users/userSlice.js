import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    removeUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user._id !== action.payload
      );
    },
  },
});

export const {
  setUsers,
  addUser,
  removeUser,
} = userSlice.actions;

export default userSlice.reducer;