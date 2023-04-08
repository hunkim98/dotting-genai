import ButtonType from "../Type/ButtonType";
import { useAppDispatch } from "@/lib/hooks";
import { setStep, setPrompt } from "@/lib/modules/aiAssistant";

// DESC: Ask for other options
const Step3 = () => {
  const dispatch = useAppDispatch();

  return (
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
  );
};

export default Step3;
