import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slice/LoginSlice";
import activeChatSlice from "../Slice/ActiveChatSingle";

const store = configureStore({
  reducer: {
    counter: authSlice,
    chta: activeChatSlice,
  },
});
export default store;
