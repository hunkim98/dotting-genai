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
      const data = (await axios.get("/pixel_character")).data;
      const result = data.result;
      // result is a batch of arrays from 0~255 rgb values
      // TODO: Accept batch of images
      const imageResults = result; // this is a result of 10 x 10 pixel values
      // create a canvas element for image1
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1000;
      const imageWidth = imageResults[0].length;
      const ctx = canvas.getContext("2d")!;
      // create a new Image object
      // set the source of the Image object
      const images: Array<string> = [];
      for (let k = 0; k < imageResults.length; k++) {
        const generated = imageResults[k];
        ctx.clearRect(0, 0, 1000, 1000);
        for (let i = 0; i < imageWidth; i++) {
          for (let j = 0; j < imageWidth; j++) {
            ctx.fillStyle = `rgb(${generated[i][j][0]}, ${generated[i][j][1]}, ${generated[i][j][2]})`;
            ctx.fillRect(
              (j * 1000) / imageWidth,
              (i * 1000) / imageWidth,
              1000 / imageWidth,
              1000 / imageWidth
            );
          }
        }
        const imgUrl = canvas.toDataURL();
        images.push(imgUrl);
      }

      dispatch(
        addMessages([
          {
            type: ChatType.TEXT,
            from: From.AI,
            content: `Your images have been regenerated. Please select the image you want to use.`,
          },
          ...images.map((url) => {
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
