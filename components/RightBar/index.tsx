import { useAppSelector } from "@/lib/hooks";
import {
  Box,
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
import GenAiImage from "./GenAiImage";

export const RightBar = () => {
  const isReceiving = useAppSelector((state) => state.genAi.isReceiving);
  const generatedImgUrls = useAppSelector(
    (state) => state.genAi.generatedImgUrls
  );
  return (
    <div>
      <Heading as="h5" size="sm">
        Generated Pixels
      </Heading>
      <div
        style={{
          minWidth: 200,
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <Grid gap={6}>
          {
            generatedImgUrls.map((url, index) => {
              return (
                <GenAiImage
                  key={url}
                  rawImageUrl={url}
                  initPixelationDegree={10}
                />
              );
            })

            // }
            // {pixelatedData.map((data, index) => {
            //   console.log(data.imgUrl, index);
            //   return (
            //     <GridItem key={data.imgUrl}>
            //       <Image
            //         src={data.imgUrl}
            //         // fill
            //         style={{ marginBottom: 10 }}
            //         alt={""}
            //         width={160}
            //         height={160}
            //       />
            //       <Slider defaultValue={60} min={0} max={300} step={30}>
            //         <SliderTrack bg="red.100">
            //           <Box position="relative" right={10} />
            //           <SliderFilledTrack bg="tomato" />
            //         </SliderTrack>
            //         <SliderThumb boxSize={6} />
            //       </Slider>
            //     </GridItem>
            //   );
            // })
          }
        </Grid>
      </div>
    </div>
  );
};

export default RightBar;
