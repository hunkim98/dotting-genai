import { useCallback, useRef } from "react";
import InputType from "../Type/InputType";
import ButtonType from "../Type/ButtonType";
import {
  setStep,
  addMessages,
  setUploadedImgUrls,
  setIsOptionsVisible,
  setIsPromptDisabled,
} from "@/lib/modules/aiAssistant";
import { useAppDispatch } from "@/lib/hooks";
import { ChatType, From } from "@/types/aiAssistant";
import { setIsReceiving } from "@/lib/modules/genAi";

// DESC: step 1 - Generate asset AI with prompt, Upload local image file
const Step1 = () => {
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLInputElement | null>(null);

  // DESC: step 1 (first option) Generate asset AI with prompt
  const generateAIWithPrompt = useCallback(() => {
    dispatch(setStep(2));
    dispatch(setIsPromptDisabled(false));
    dispatch(setIsOptionsVisible(false));
  }, [dispatch]);

  // DESC: step 1 (second option) Upload local image file
  const uploadLocalImageFile = useCallback(async () => {
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

      setTimeout(() => {}, 1000);

      try {
        dispatch(
          addMessages([
            {
              type: ChatType.TEXT,
              from: From.AI,
              content: `Requested images have been generated. 
              Use the below sliders to control the pixel grids. 
              Click the image if you would like to use it on your canvas.`,
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
        option={{
          title: "Generate asset AI with prompt",
          action: generateAIWithPrompt,
        }}
      />
      <InputType
        isLastOption
        ref={imgRef}
        option={{
          title: "Upload local image file",
          action: uploadLocalImageFile,
        }}
      />
    </>
  );
};

export default Step1;
