import { createSlice } from "@reduxjs/toolkit";

export const activeChatSlice = createSlice({
  name: "activeChat",
  initialState: {
    active: localStorage.getItem("activeUsers")
      ? JSON.parse(localStorage.getItem("activeUsers"))
      : null,
  },
  reducers: {
    loginActiveChat: (state, action) => {
      state.active = action.payload;
    },
  },
});
export const { loginActiveChat } = activeChatSlice.actions;
export default activeChatSlice.reducer;
