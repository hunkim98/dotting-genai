import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type UserState = {
  userId: string;
};

export const UserInitialState: UserState = {
  userId: uuidv4(),
};

export const userModule = createSlice({
  name: "user",
  initialState: UserInitialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});
