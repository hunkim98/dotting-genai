import { DottingData } from "dotting";
import React, { useMemo } from "react";
import { createContext } from "react";

//https://velog.io/@velopert/react-context-tutorial

interface GenAiDataType {
  selectedDottingData: DottingData | null;
  setSelectedDottingData: React.Dispatch<
    React.SetStateAction<DottingData | null>
  >;
}
export const GenAiDataContext = createContext({} as GenAiDataType);

function GenAiDataContextProvier({ children }: { children: React.ReactNode }) {
  const [selectedDottingData, setSelectedDottingData] =
    React.useState<DottingData | null>(null);

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
