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

// DESC: step 0 - Create me an asset, Create me a background
const Step0 = () => {
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLInputElement | null>(null);

  // DESC: step 0 (first option) Create me an asset
  const createAsset = useCallback(() => {
    dispatch(setStep(1));
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
        option={{ title: "Create me an asset", action: createAsset }}
      />
      <InputType
        isLastOption
        ref={imgRef}
        option={{ title: "Create me a background", action: createBackground }}
      />
    </>
  );
};

export default Step0;