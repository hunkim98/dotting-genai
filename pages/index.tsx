import { useCallback, useContext, useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
import { Button } from "@chakra-ui/react";
import RightBar from "@/components/RightBar";

import {
  Dotting,
  DottingRef,
  useDotting,
  useHandlers,
  PixelModifyItem,
  CanvasHoverPixelChangeHandler,
} from "dotting";
import {
  setStep,
  setPrompt,
  setMessages,
  addMessages,
  setIsRightBar,
  setIsOptionsVisible,
  setIsPromptDisabled,
} from "@/lib/modules/aiAssistant";
import { ChatType, From } from "@/types/aiAssistant";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { GenAiDataContext } from "@/context/GenAiDataContext";
import { setGeneratedImgUrls, setIsReceiving } from "@/lib/modules/genAi";
import { DIFFUSION_URL } from "@/constants/urls";

export default function Home() {
  const ref = useRef<DottingRef>(null);

  const dispatch = useAppDispatch();
  const { prompt, step, isRightBar, messages } = useAppSelector(
    (state) => state.aiAssistant
  );
  const { selectedDottingData, setSelectedDottingData } =
    useContext(GenAiDataContext);

  const {
    addHoverPixelChangeListener,
    removeHoverPixelChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
  } = useHandlers(ref);
  const { setIndicatorPixels, colorPixels } = useDotting(ref);

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

  /* 
    🖍 ABOUT RightBar
  */
  const callImage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!prompt.trim()) {
        dispatch(setPrompt(""));
        return;
      }

      dispatch(
        addMessages([
          {
            type: ChatType.TEXT,
            from: From.USER,
            content: `${prompt}`,
          },
          {
            type: ChatType.TEXT,
            from: From.AI,
            content: "Generating image... Please wait a few seconds.",
          },
        ])
      );

      // for loading, and disable prompt
      dispatch(setIsReceiving(true));
      dispatch(setIsPromptDisabled(true));
      try {
        const response = await axios.post(
          `${DIFFUSION_URL}`,
          { prompt },
          { responseType: "arraybuffer" }
        );
        const img = response.data;
        const buffer = Buffer.from(img, "utf-8");
        const bufferData = buffer.toJSON().data;
        const view = new Uint8Array(bufferData);
        const blob = new Blob([view], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        const tempImgUrls: Array<string> = [url];
        dispatch(setGeneratedImgUrls(tempImgUrls));

        dispatch(
          addMessages([
            {
              type: ChatType.TEXT,
              from: From.AI,
              content: `‘${prompt}’ images have been generated. 
              Use the below sliders to control the pixel grids. 
              Click the image if you would like to use it on your canvas.`,
            },
            ...tempImgUrls.map((url) => {
              return {
                type: ChatType.GENAIIMAGE,
                from: From.AI,
                content: url,
              };
            }),
          ])
        );
      } catch (error) {
        console.error(error);
        alert("Error has happened while generating image data");
      }
      // for next step
      dispatch(setStep(2));
      dispatch(setIsReceiving(false));
      dispatch(setIsOptionsVisible(true));
    },
    [prompt, dispatch]
  );

  // for accumulating messages log
  useEffect(() => {
    if (step === 0) {
      dispatch(
        setMessages([
          ...messages,
          {
            type: ChatType.TEXT,
            From: From.AI,
            content: "Hello this is Dotting Ai, how may I help you?",
          },
        ])
      );
    } else if (step === 1) {
      dispatch(
        addMessages([
          {
            type: ChatType.TEXT,
            From: From.AI,
            content: "How would you like to create an asset?",
          },
        ])
      );
    } else if (step === 2) {
      dispatch(
        addMessages([
          {
            type: ChatType.TEXT,
            From: From.AI,
            content: "Please input your prompt.",
          },
        ])
      );
    }
  }, [step]);

  return (
    <>
      <Head>
        <title>Dotting gen-ai</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ display: "flex", width: "100vw" }}>
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
            width={isRightBar ? "calc(100% - 330px)" : "100%"}
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
          {isRightBar ? (
            <RightBar onSubmit={callImage} />
          ) : (
            <Button
              borderRadius="16"
              onClick={() => dispatch(setIsRightBar(true))}
              style={{ position: "absolute", right: "20px", top: "24px" }}
              colorScheme="teal"
            >
              Open Dotting Ai Assistant
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
