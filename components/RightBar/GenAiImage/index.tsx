import { pixelateImage } from "@/utils/image/pixelateImage";
import {
  Box,
  Center,
  Container,
  GridItem,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DottingData } from "@/../dotting/build/src";
import { useAppDispatch } from "@/lib/hooks";
import { GenAiDataContext } from "@/context/GenAiDataContext";

interface Props {
  rawImageUrl: string;
  initPixelationDegree: number;
}

const GenAiImage: React.FC<Props> = ({ rawImageUrl, initPixelationDegree }) => {
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [pixelationDegree, setPixelationDegree] =
    useState<number>(initPixelationDegree);
  const dottingData = useRef<DottingData | null>(null);
  useEffect(() => {
    pixelateImage(rawImageUrl, pixelationDegree).then(({ imgUrl, data }) => {
      setPreviewImgUrl(imgUrl);
      dottingData.current = data;
    });
  }, [rawImageUrl, pixelationDegree, dottingData]);
  const { setSelectedDottingData } = useContext(GenAiDataContext);

  if (!previewImgUrl) {
    return null;
  }

  return (
    <GridItem
      key={previewImgUrl}
      sx={{
        paddingTop: 2,
      }}
    >
      <Center
        sx={{
          position: "relative",
          marginBottom: 5,
          ":hover": {
            transform: "scale(1.04)",
            transition: "transform 0.2s",
          },
        }}
      >
        {isHovered && (
          <Center
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              // width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              pointerEvents: "none",
              textAlign: "center",
              color: "white",
            }}
          >
            <strong>Click Image to use in canvas</strong>
          </Center>
        )}
        <Image
          src={previewImgUrl}
          // fill

          alt={""}
          width={160}
          height={160}
          style={{
            cursor: "pointer",
          }}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          onClick={() => {
            if (dottingData.current) {
              setSelectedDottingData(dottingData.current);
            }
          }}
        />
      </Center>
      <Slider
        defaultValue={6}
        min={2}
        max={6}
        step={1}
        value={pixelationDegree}
        onChange={(val) => {
          setPixelationDegree(val);
        }}
      >
        <SliderTrack bg="green.100">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="teal" />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </GridItem>
  );
};

export default GenAiImage;
