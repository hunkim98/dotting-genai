import InputType from "../Type/InputType";
import ButtonType from "../Type/ButtonType";
import { setStep, setUploadedImgFile } from "@/lib/modules/aiAssistant";
import { useAppDispatch } from "@/lib/hooks";
import { useCallback, useRef } from "react";

const SelectCreatingAssetMode = () => {
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLInputElement | null>(null);

  // step 1-1 (Create me an asset)
  const createAsset = useCallback(() => {
    dispatch(setStep(1));
  }, [dispatch]);

  // step 1-2
  const createBackground = useCallback(() => {}, []);

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
        option={{ title: "Create me an asset", action: createAsset }}
      />
      <InputType
        isLastOption
        ref={imgRef}
        option={{ title: "Create me a background", action: createBackground }}
        onChange={onChangeImg}
      />
    </>
  );
};

export default SelectCreatingAssetMode;
