import { DottingData } from "@/../dotting/build/src";
import React, { useMemo } from "react";
import { createContext } from "react";

//https://velog.io/@velopert/react-context-tutorial

interface GenAiDataType {
  isReceiving: boolean;
  setIsReceiving: (isReceiving: boolean) => void;
  data: Array<{ url: string; data: DottingData }>;
  setData: (data: Array<{ url: string; data: DottingData }>) => void;
}
const GenAiDataContext = createContext({} as GenAiDataType);

function GenAiDataContextProvier({ children }: { children: React.ReactNode }) {
  const [isReceiving, setIsReceiving] = React.useState(false);

  const [data, setData] = React.useState<
    Array<{ url: string; data: DottingData }>
  >([]);

  const value = useMemo(
    () => ({
      isReceiving,
      setIsReceiving,
      data,
      setData,
    }),
    [isReceiving, setIsReceiving, data, setData]
  );
  return (
    <GenAiDataContext.Provider value={value}>
      {children}
    </GenAiDataContext.Provider>
  );
}

export default GenAiDataContextProvier;
