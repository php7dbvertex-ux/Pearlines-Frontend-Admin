import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    admin: null,
  },

  reducers: {},
});

export default authSlice.reducer;