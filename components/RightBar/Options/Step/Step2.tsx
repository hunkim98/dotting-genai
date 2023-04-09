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
import { DIFFUSION_URL } from "@/constants/urls";
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
          content: "Regenerating images... Please wait a few seconds.",
        },
      ])
    );

    try {
      // we will call diffusion api two times to get two images
      const responses = await Promise.all([
        axios.post(
          `${DIFFUSION_URL}`,
          { prompt },
          { responseType: "arraybuffer" }
        ),
        axios.post(
          `${DIFFUSION_URL}`,
          { prompt },
          { responseType: "arraybuffer" }
        ),
      ]);
      const response = await axios.post("/api/diffusion", { prompt });
      const buffers = response.data.buffers;
      const tempImgUrls: Array<string> = [];
      for (const buffer of buffers) {
        const bufferData = new Uint8Array(buffer);
        const blob = new Blob([bufferData], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        tempImgUrls.push(url);
      }
      // for (const response of responses) {
      //   const img = response.data;
      //   const buffer = Buffer.from(img, "utf-8");
      //   const bufferData = buffer.toJSON().data;
      //   const view = new Uint8Array(bufferData);
      //   const blob = new Blob([view], { type: "image/png" });
      //   const url = URL.createObjectURL(blob);
      //   tempImgUrls.push(url);
      // }
      dispatch(setGeneratedImgUrls(tempImgUrls));

      dispatch(
        addMessages([
          {
            type: ChatType.TEXT,
            from: From.AI,
            content: `Your images have been regenerated. Please select the image you want to use.`,
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
