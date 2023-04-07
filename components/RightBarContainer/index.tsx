import React, { useCallback } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useChatContext } from "@/context/ChatContext";

import RightBar from "../RightBar";
// import GenAiImage from "./GenAiImage";

export const RightBarContainer = () => {
  const { keyword, setKeyword } = useChatContext();

  // TODO: request dalle
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      if (!keyword.trim()) {
        setKeyword("");
        return;
      }
      // TODO: to get image
      setKeyword("");
    },
    [keyword, setKeyword]
  );

  const isReceiving = useAppSelector((state) => state.genAi.isReceiving);
  const generatedImgUrls = useAppSelector(
    (state) => state.genAi.generatedImgUrls
  );

  return (
    <>
      <RightBar handleSubmit={handleSubmit} />

      {/* <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <Grid gap={6}>
          {generatedImgUrls.map((url, index) => {
            return (
              <GenAiImage
                key={url}
                rawImageUrl={url}
                initPixelationDegree={10}
              />
            );
          })}
        </Grid>
      </div> */}
    </>
  );
};

export default RightBarContainer;
