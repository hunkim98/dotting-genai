import { useAppSelector } from "@/lib/hooks";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import Chats from "./Chats";
import GenAiImage from "./GenAiImage";

export const RightBar = () => {
  const isReceiving = useAppSelector((state) => state.genAi.isReceiving);
  const generatedImgUrls = useAppSelector(
    (state) => state.genAi.generatedImgUrls
  );
  return (
    <Flex
      w="300px"
      h="100vh"
      justify="center"
      align="center"
      backgroundColor={"#EEEEEE"}
      sx={{
        minWidth: "300px",
      }}
    >
      <Flex w="100%" h="100%" flexDir="column">
        <Heading as="h5" size="sm">
          Generated Pixels
        </Heading>
        <Chats
          messages={[
            { from: "user", text: "hi" },
            { from: "ai", text: "hello" },
          ]}
        />

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
      </Flex>
    </Flex>
  );
};

export default RightBar;
