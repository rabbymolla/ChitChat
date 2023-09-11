import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: localStorage.getItem("users")
      ? JSON.parse(localStorage.getItem("users"))
      : null,
  },
  reducers: {
    loginUsers: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { loginUsers } = counterSlice.actions;
export default counterSlice.reducer;
