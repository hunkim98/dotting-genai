import { useCallback, useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import {
  Dotting,
  DottingRef,
  useDotting,
  useHandlers,
  DottingData,
  PixelModifyItem,
  CanvasHoverPixelChangeHandler,
} from "dotting";

import styles from "@/styles/Home.module.css";
import { Button, Center, Input } from "@chakra-ui/react";
import RightBarContainer from "@/components/RightBarContainer";

import { getDataUri } from "@/utils/image/getDataUri";
import { pixelateImage } from "@/utils/image/pixelateImage";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { GenAiDataContext } from "@/context/GenAiDataContext";
import { setGeneratedImgUrls, setIsReceiving } from "@/lib/modules/genAi";

export default function Home() {
  const ref = useRef<DottingRef>(null);
  const { selectedDottingData, setSelectedDottingData } =
    useContext(GenAiDataContext);
  const isReceiving = useAppSelector((state) => state.genAi.isReceiving);
  const [prompt, setPrompt] = useState<string>("");
  const dispatch = useAppDispatch();
  const {
    addHoverPixelChangeListener,
    removeHoverPixelChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
  } = useHandlers(ref);
  const { setIndicatorPixels, colorPixels } = useDotting(ref);
  const [isRightBarActive, setIsRightBarActive] = useState(true);

  const hoveredPixel = useRef<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  const handleHoverPixelChangeHandler =
    useCallback<CanvasHoverPixelChangeHandler>(
      (indices) => {
        if (indices === null) {
          return;
        }
        console.log("hi");
        const { rowIndex, columnIndex } = indices;
        hoveredPixel.current = {
          rowIndex,
          columnIndex,
        };
        if (selectedDottingData === null) {
          return;
        }
        const tempIndicators: Array<PixelModifyItem> = [];
        const selectedWidth = selectedDottingData.size;
        const selectedHeight = selectedDottingData.entries().next().value[1]
          .size as number;
        const widthOffset = Math.floor(selectedWidth / 2);
        const heightOffset = Math.floor(selectedHeight / 2);
        selectedDottingData.forEach((dottingData, dataRowIndex) => {
          dottingData.forEach((dottingData, dataColumnIndex) => {
            if (dottingData === null) {
              return;
            }
            tempIndicators.push({
              rowIndex: dataRowIndex + rowIndex - widthOffset,
              columnIndex: dataColumnIndex + columnIndex - heightOffset,
              color: dottingData.color,
            });
          });
        });
        setIndicatorPixels(tempIndicators);
      },

      [hoveredPixel, setIndicatorPixels, selectedDottingData]
    );

  useEffect(() => {
    const escapeKeyEvent = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedDottingData(null);
        setIndicatorPixels([]);
      }
    };
    window.addEventListener("keydown", escapeKeyEvent);
    return () => {
      window.removeEventListener("keydown", escapeKeyEvent);
    };
  }, [setSelectedDottingData, setIndicatorPixels]);

  useEffect(() => {
    const colorIndicators = (event: Event) => {
      if (!selectedDottingData) {
        return;
      }
      if (hoveredPixel.current !== null) {
        const tempIndicators: Array<PixelModifyItem> = [];
        const selectedWidth = selectedDottingData.size;
        const selectedHeight = selectedDottingData.entries().next().value[1]
          .size as number;
        const widthOffset = Math.floor(selectedWidth / 2);
        const heightOffset = Math.floor(selectedHeight / 2);
        const { rowIndex, columnIndex } = hoveredPixel.current;
        selectedDottingData.forEach((dottingData, dataRowIndex) => {
          dottingData.forEach((dottingData, dataColumnIndex) => {
            if (dottingData === null) {
              return;
            }
            tempIndicators.push({
              rowIndex: dataRowIndex + rowIndex - widthOffset,
              columnIndex: dataColumnIndex + columnIndex - heightOffset,
              color: dottingData.color,
            });
          });
        });
        colorPixels(tempIndicators);
      }
    };
    addCanvasElementEventListener("mousedown", colorIndicators);
    return () => {
      removeCanvasElementEventListener("mousedown", colorIndicators);
    };
  }, [
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
    hoveredPixel,
    colorPixels,
    selectedDottingData,
  ]);

  useEffect(() => {
    addHoverPixelChangeListener(handleHoverPixelChangeHandler);
    return () => {
      removeHoverPixelChangeListener(handleHoverPixelChangeHandler);
    };
  }, [
    addHoverPixelChangeListener,
    removeHoverPixelChangeListener,
    handleHoverPixelChangeHandler,
  ]);

  const callImage = useCallback(async () => {
    dispatch(setIsReceiving(true));
    try {
      const response = await axios.post("api/openai/dalle", {
        queryPrompt: prompt,
      });
      const buffers = response.data.buffers;
      const tempImgUrls: Array<string> = [];
      for (const buffer of buffers) {
        const view = new Uint8Array(buffer);
        const blob = new Blob([view], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        tempImgUrls.push(url);
      }
      dispatch(setGeneratedImgUrls(tempImgUrls));
      dispatch(setIsReceiving(false));
    } catch (error) {
      console.error(error);
      alert("Error has happened while generating image data");
      dispatch(setIsReceiving(false));
    }
  }, [dispatch, prompt]);

  const enhancePrompt = useCallback(async () => {
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }
    setPrompt("cartoon-style " + prompt + " with white background");
  }, [prompt, setPrompt]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ display: "flex", width: "100vw" }}>
        {isReceiving && <div>Receiving</div>}
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            position: "relative",
          }}
        >
          <Dotting
            ref={ref}
            width={isRightBarActive ? "calc(100% - 330px)" : "100%"}
            height={"100vh"}
            initData={Array(30)
              .fill("")
              .map((out, outIndex) => {
                return Array(30)
                  .fill("")
                  .map((inner, innerIndex) => {
                    return {
                      color: "",
                      rowIndex: outIndex,
                      columnIndex: innerIndex,
                    };
                  });
              })}
          />
          {isRightBarActive ? (
            <RightBarContainer setIsRightBarActive={setIsRightBarActive} />
          ) : (
            <Button
              borderRadius="16"
              onClick={() => setIsRightBarActive(true)}
              style={{ position: "absolute", right: "20px", top: "24px" }}
              // colorScheme="linear-gradient(91.59deg, #309695 17.75%, rgba(238, 238, 238) 172.19%);"
              colorScheme="teal"
            >
              Open Dotting Ai Assistant
            </Button>
          )}
        </div>

        {/* <Center
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Input
            value={prompt}
            style={{ fontSize: 20, margin: 5, padding: 10 }}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Button
            style={{
              // padding: 10,
              margin: 5,
            }}
            onClick={enhancePrompt}
          >
            Enhance prompt
          </Button>
          <Button colorScheme="teal" style={{ margin: 5 }} onClick={callImage}>
            Generate images
          </Button>
        </Center> */}
      </main>
    </>
  );
}
