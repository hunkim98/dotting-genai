import { DottingData } from "dotting";
import React, { useMemo } from "react";
import { createContext } from "react";

//https://velog.io/@velopert/react-context-tutorial

interface GenAiDataType {
  selectedDottingData: {
    data: DottingData;
    width: number;
    height: number;
  } | null;
  setSelectedDottingData: React.Dispatch<
    React.SetStateAction<{
      data: DottingData;
      width: number;
      height: number;
    } | null>
  >;
}
export const GenAiDataContext = createContext({} as GenAiDataType);

function GenAiDataContextProvier({ children }: { children: React.ReactNode }) {
  const [selectedDottingData, setSelectedDottingData] = React.useState<{
    data: DottingData;
    width: number;
    height: number;
  } | null>(null);

  const value = useMemo(
    () => ({
      selectedDottingData,
      setSelectedDottingData,
    }),
    [selectedDottingData, setSelectedDottingData]
  );
  return (
    <GenAiDataContext.Provider value={value}>
      {children}
    </GenAiDataContext.Provider>
  );
}

export default GenAiDataContextProvier;
