import Step0 from "./Step/Step0";
import Step1 from "./Step/Step1";
import Step2 from "./Step/Step2";
import Step3 from "./Step/Step3";
import { useAppSelector } from "@/lib/hooks";

const Options = () => {
  const { step } = useAppSelector((state) => state.aiAssistant);

  if (step === 0) {
    return <Step0 />;
  } else if (step === 1) {
    return <Step1 />;
  } else if (step === 2) {
    return <Step2 />;
  } else {
    return <Step3 />;
  }
};

export default Options;
