import { pixelateImage } from "@/utils/image/pixelateImage";
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
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { DottingData, PixelData } from "@/../dotting/build/src";
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
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      sx={{
        ":hover": {
          transform: "scale(1.04)",
          transition: "transform 0.2s",
        },
      }}
    >
      <Image
        src={previewImgUrl}
        // fill
        style={{ marginBottom: 10 }}
        alt={""}
        width={160}
        height={160}
        onClick={() => {
          console.log(typeof dottingData.current, "current");
          if (dottingData.current) {
            setSelectedDottingData(dottingData.current);
          }
        }}
      />
      <Slider
        defaultValue={10}
        min={5}
        max={10}
        step={1}
        value={pixelationDegree}
        onChange={(val) => {
          setPixelationDegree(val);
        }}
        // onChangeEnd={(val) => {
        //   setPixelationDegree(val);
        // }}
      >
        <SliderTrack bg="red.100">
          <Box position="relative" right={10} />
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </GridItem>
  );
};

export default GenAiImage;
