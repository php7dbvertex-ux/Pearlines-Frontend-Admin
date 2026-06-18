import { createSlice } from "@reduxjs/toolkit";

const doctorSlice = createSlice({
  name: "auth",

  initialState: {
    admin: null,
  },

  reducers: {},
});

export default doctorSlice.reducer;