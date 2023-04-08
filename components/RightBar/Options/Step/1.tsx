import { useCallback, useRef } from "react";
import InputType from "../Type/InputType";
import ButtonType from "../Type/ButtonType";
import {
  setIsOptionsVisible,
  setIsPromptDisabled,
  setStep,
  setUploadedImgFile,
} from "@/lib/modules/aiAssistant";
import { useAppDispatch } from "@/lib/hooks";

const SelectHowToGetImageMode = () => {
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLInputElement | null>(null);

  // step 2-1
  const generateAIWithPrompt = useCallback(() => {
    dispatch(setStep(2));
    dispatch(setIsPromptDisabled(false));
    dispatch(setIsOptionsVisible(false));
  }, [dispatch]);

  // step 2-2
  const uploadLocalImageFile = useCallback(() => {}, []);

  const onChangeImg = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (imgRef && imgRef.current && imgRef.current.files) {
        const maxSize = 5 * 1024 * 1024;

        if (imgRef.current.files[0].size >= maxSize) {
          alert(`Only images smaller than ${maxSize}(MB) can be registered.`);
          return;
        }

        dispatch(setUploadedImgFile(imgRef.current.files[0]));
      }
    },
    [dispatch]
  );

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
        onChange={onChangeImg}
      />
    </>
  );
};

export default SelectHowToGetImageMode;
