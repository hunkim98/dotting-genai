import { createSlice } from "@reduxjs/toolkit";
import { MessageType } from "@/types/aiAssistant";

export type AiAssistantState = {
  step: number;
  prompt: string;
  isRightBarOpen: boolean;
  messages: MessageType[];
  isPromptDisabled: boolean;
  isOptionsVisible: boolean;
  uploadedImgUrls: string[] | Blob[];
};

export const InitialState: AiAssistantState = {
  step: 0,
  prompt: "",
  uploadedImgUrls: [],
  isRightBarOpen: false,
  isOptionsVisible: true,
  isPromptDisabled: true,
  messages: [] as MessageType[],
};

export const aiAssistantModule = createSlice({
  name: "aiAssistant",
  initialState: InitialState,
  reducers: {
    setIsRightBarOpen: (state, action) => {
      state.isRightBarOpen = action.payload;
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessages: (state, action) => {
      state.messages.push(...action.payload);
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setIsPromptDisabled: (state, action) => {
      state.isPromptDisabled = action.payload;
    },
    setIsOptionsVisible: (state, action) => {
      state.isOptionsVisible = action.payload;
    },
    setUploadedImgUrls: (state, action) => {
      state.uploadedImgUrls = action.payload;
    },
  },
});

export const {
  setStep,
  setPrompt,
  setMessages,
  addMessages,
  setIsRightBarOpen,
  setUploadedImgUrls,
  setIsOptionsVisible,
  setIsPromptDisabled,
} = aiAssistantModule.actions;
