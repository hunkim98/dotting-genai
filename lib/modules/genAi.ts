import { createSlice } from "@reduxjs/toolkit";
import { DottingData, PixelData } from "dotting";

export type GenAiState = {
  isReceiving: boolean;
  loadingMessage: string;
  generatedImgUrls: Array<string>;
};

export const GenAiInitialState: GenAiState = {
  isReceiving: false,
  loadingMessage: "",
  generatedImgUrls: [],
};

export const genAiModule = createSlice({
  name: "genAi",
  initialState: GenAiInitialState,
  reducers: {
    setIsReceiving: (state, action) => {
      state.isReceiving = action.payload;
    },
    setLoadingMessage: (state, action) => {
      state.loadingMessage = action.payload;
    },
    setGeneratedImgUrls: (state, action) => {
      state.generatedImgUrls = action.payload;
    },
  },
});

export const { setIsReceiving, setGeneratedImgUrls } = genAiModule.actions;
