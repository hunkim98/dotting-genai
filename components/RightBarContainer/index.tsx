import React, { useCallback, useState } from "react";
import { Image } from "@chakra-ui/react";
import { useAppSelector } from "@/lib/hooks";

import { From } from "../types";
import RightBar from "../RightBar";
import Options from "../RightBar/Options";
// import GenAiImage from "./GenAiImage";

export const RightBarContainer = ({
  setIsRightBarActive,
}: {
  setIsRightBarActive: (v: boolean) => void;
}) => {
  // DESC: search keyword for prompt
  const [keyword, setKeyword] = useState("");

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    []
  );

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
    [keyword]
  );

  /*
    📩 Send the contents of the chat in the form of 'from' and 'content' array.
  */
  const [messages, setMessages] = useState<
    { from: From; content: React.ReactNode }[]
  >([
    {
      from: From.AI,
      content: "Hello this is Dotting Ai, how may I help you?",
    },
    {
      from: From.AI,
      content: "How would you like to create an asset?",
    },
    {
      from: From.USER,
      content: "Create me an asset.",
    },
    {
      from: From.AI,
      content: (
        <Image
          src="https://post-phinf.pstatic.net/MjAxODAzMDJfMzcg/MDAxNTE5OTI4OTY5NTI2.wAmNqnMG0QX0snU_mPDk6PUrzbEY6buIQoFl5pRdKJwg.y8mu7rj35I0wSMUY1isb0Fw9ZGxVcpzRSh8rmJh3jDAg.JPEG/IQFkIuo9jfMHN4VfUe2kbNZ7bNm8.jpg?type=w400"
          alt="sample"
        />
      ),
    },
  ]);

  /* 
    Array to contain options for selection. 
    Write down the function corresponding to the action and title.
  */
  const [options, setOptions] = useState<
    { title: string; action: () => void }[]
  >([
    {
      title: "Create me an asset",
      action: () => {
        console.log("Create me an asset");
      },
    },
    {
      title: "Create me a background",
      action: () => {
        console.log("Create me a background");
      },
    },
    {
      title: "Ask for other options",
      action: () => {
        console.log("Ask for other options");
      },
    },
  ]);

  const isReceiving = useAppSelector((state) => state.genAi.isReceiving);
  const generatedImgUrls = useAppSelector(
    (state) => state.genAi.generatedImgUrls
  );

  return (
    <>
      <RightBar
        keyword={keyword}
        messages={messages}
        handleSubmit={handleSubmit}
        handleChange={handleChangeKeyword}
        setIsRightBarActive={setIsRightBarActive}
      >
        {/* This is the part to be displayed under the CHAT component. */}
        {/* Specify options state for each step as children */}
        <Options options={options} />
      </RightBar>

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
