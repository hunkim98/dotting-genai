import { useAppSelector } from "@/lib/hooks";
import SelectCreatingAssetMode from "./Step/0";
import SelectHowToGetImageMode from "./Step/1";
import SelectWhatsNextUp from "./Step/2";

const Options = () => {
  const { step } = useAppSelector((state) => state.aiAssistant);

  if (step === 0) {
    return <SelectCreatingAssetMode />;
  } else if (step === 1) {
    return <SelectHowToGetImageMode />;
  } else {
    return <SelectWhatsNextUp />;
  }
};

export default Options;
