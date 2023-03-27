import { createSlice } from "@reduxjs/toolkit";
import { DottingData } from "dotting";

export type GenAiState = {
  isReceiving: boolean;
  pixelatedData: Array<{ imgUrl: string; data: DottingData }>;
};

export const GenAiInitialState: GenAiState = {
  isReceiving: false,
  pixelatedData: [],
};

export const genAiModule = createSlice({
  name: "genAi",
  initialState: GenAiInitialState,
  reducers: {
    setIsReceiving: (state, action) => {
      state.isReceiving = action.payload;
    },
    setPixelatedData: (state, action) => {
      state.pixelatedData = action.payload;
    },
  },
});

export const { setIsReceiving, setPixelatedData } = genAiModule.actions;
