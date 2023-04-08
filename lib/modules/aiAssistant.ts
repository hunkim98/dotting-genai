import { createSlice } from "@reduxjs/toolkit";
import { MessageType } from "@/types/aiAssistant";

export type AiAssistantState = {
  step: number;
  prompt: string;
  isRightBar: boolean;
  messages: MessageType[];
  isPromptDisabled: boolean;
  isOptionsVisible: boolean;
  uploadedImgFile: string | Blob;
};

export const InitialState: AiAssistantState = {
  step: 0,
  prompt: "",
  uploadedImgFile: "",
  isRightBar: false,
  isOptionsVisible: true,
  isPromptDisabled: true,
  messages: [] as MessageType[],
};

export const aiAssistantModule = createSlice({
  name: "aiAssistant",
  initialState: InitialState,
  reducers: {
    setIsRightBar: (state, action) => {
      state.isRightBar = action.payload;
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
    setUploadedImgFile: (state, action) => {
      state.uploadedImgFile = action.payload;
    },
  },
});

export const {
  setStep,
  setPrompt,
  setMessages,
  addMessages,
  setIsRightBar,
  setUploadedImgFile,
  setIsOptionsVisible,
  setIsPromptDisabled,
} = aiAssistantModule.actions;
