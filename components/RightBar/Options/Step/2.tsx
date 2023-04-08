import { useCallback } from "react";
import axios from "axios";

import {
  setStep,
  setPrompt,
  addMessages,
  setIsOptionsVisible,
  setIsPromptDisabled,
} from "@/lib/modules/aiAssistant";
import ButtonType from "../Type/ButtonType";
import { ChatType, From } from "@/types/aiAssistant";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setGeneratedImgUrls, setIsReceiving } from "@/lib/modules/genAi";

// DESC: Regenerate, ask for other options
const Step2 = () => {
  const dispatch = useAppDispatch();
  const { prompt } = useAppSelector((state) => state.aiAssistant);

  // step 2 (first step) Regenerate
  const regenerate = useCallback(async () => {
    // DESC: for loading, cannot select next option
    dispatch(setIsReceiving(true));
    dispatch(setIsPromptDisabled(true));
    dispatch(setIsOptionsVisible(false));

    dispatch(
      addMessages([
        {
          type: ChatType.TEXT,
          from: From.AI,
          content: "Regenerating image... Please wait a few seconds.",
        },
      ])
    );

    try {
      const response = await axios.post(
        "http://34.64.163.60:3000/txt2img",
        { prompt },
        { responseType: "arraybuffer" }
      );
      const img = response.data;
      const buffer = Buffer.from(img, "utf-8");
      const bufferData = buffer.toJSON().data;
      const view = new Uint8Array(bufferData);
      const blob = new Blob([view], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      const tempImgUrls: Array<string> = [url];
      dispatch(setGeneratedImgUrls(tempImgUrls));

      dispatch(
        addMessages([
          {
            type: ChatType.TEXT,
            from: From.AI,
            content: `‘${prompt}’ images have been generated. Use the below sliders to control the pixel grids. Click the image if you would like to use it on your canvas.`,
          },
          ...tempImgUrls.map((url) => {
            return {
              type: ChatType.GENAIIMAGE,
              from: From.AI,
              content: url,
            };
          }),
        ])
      );
    } catch (error) {
      console.error(error);
      alert("Error has happened while generating image data");
    }

    // DESC: for changing step, loading, can select next option
    dispatch(setStep(2));
    dispatch(setIsReceiving(false));
    dispatch(setIsOptionsVisible(true));
  }, [dispatch, prompt]);

  return (
    <>
      <ButtonType
        option={{
          title: "Regenerate",
          action: regenerate,
        }}
      />
      <ButtonType
        isLastOption
        option={{
          title: "Ask for other options",
          action: () => {
            dispatch(setPrompt(""));
            dispatch(setStep(0));
          },
        }}
      />
    </>
  );
};

export default Step2;
