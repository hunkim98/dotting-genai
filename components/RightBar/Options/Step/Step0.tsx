import { useCallback, useRef } from "react";
import InputType from "../Type/InputType";
import ButtonType from "../Type/ButtonType";
import {
  setStep,
  addMessages,
  setIsOptionsVisible,
  setUploadedImgUrls,
} from "@/lib/modules/aiAssistant";
import { setIsReceiving } from "@/lib/modules/genAi";
import { ChatType, From } from "@/types/aiAssistant";
import { useAppDispatch } from "@/lib/hooks";
import axios from "axios";

// DESC: step 0 - Create me an asset, Create me a background
const Step0 = () => {
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLInputElement | null>(null);

  // DESC: step 0 (first option) Create me an asset
  const createAsset = useCallback(async () => {
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
    // add the Image object to the DOM

    try {
      dispatch(
        addMessages([
          {
            type: ChatType.TEXT,
            from: From.AI,
            content: `Your images have been generated. Please select the image you want to use.`,
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
    }

    dispatch(setStep(2));
  }, [dispatch]);

  // DESC: step 0 (second option) Create me a background
  const createBackground = useCallback(async () => {
    // DESC: for loading, cannot select next option
    dispatch(setIsReceiving(true));
    dispatch(setIsOptionsVisible(false));

    if (imgRef && imgRef.current && imgRef.current.files) {
      const maxSize = 5 * 1024 * 1024;

      if (imgRef.current.files[0].size >= maxSize) {
        alert(`Only images smaller than ${maxSize}(MB) can be registered.`);
        return;
      }

      const file = imgRef.current.files[0];
      const imgUrl = URL.createObjectURL(file);
      const tempImgUrls: Array<string> = [];
      tempImgUrls.push(imgUrl);
      dispatch(setUploadedImgUrls(tempImgUrls));

      try {
        dispatch(
          addMessages([
            {
              type: ChatType.TEXT,
              from: From.AI,
              content: `Your images have been generated. Please select the image you want to use.`,
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
      }

      // DESC: change step, loading=false, can select next option
      dispatch(setStep(3));
      dispatch(setIsReceiving(false));
      dispatch(setIsOptionsVisible(true));
    }
  }, [dispatch]);

  return (
    <>
      <ButtonType
        option={{ title: "Generate a character", action: createAsset }}
      />
      <InputType
        isLastOption
        ref={imgRef}
        option={{ title: "Pixelate my local image", action: createBackground }}
      />
    </>
  );
};

export default Step0;
