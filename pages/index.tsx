import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Button } from "@chakra-ui/react";
import RightBar from "@/components/RightBar";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";

import {
  Dotting,
  DottingRef,
  useDotting,
  useHandlers,
  PixelModifyItem,
  CanvasHoverPixelChangeHandler,
  CanvasStrokeEndHandler,
  useData,
  useBrush,
  BrushTool,
} from "dotting";
import {
  setStep,
  setPrompt,
  setMessages,
  addMessages,
  setIsRightBarOpen,
  setIsOptionsVisible,
  setIsPromptDisabled,
} from "@/lib/modules/aiAssistant";
import { ChatType, From } from "@/types/aiAssistant";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { GenAiDataContext } from "@/context/GenAiDataContext";
import { setGeneratedImgUrls, setIsReceiving } from "@/lib/modules/genAi";
import { DIFFUSION_URL } from "@/constants/urls";
import { PostTrackStrokeBodyDto } from "@/dto/track/body/post.track.stroke.body.dto";
import { getNeighboringPixels } from "@/utils/record";

const neighborMaxDegree = 2;

export default function Home() {
  const ref = useRef<DottingRef>(null);
  const [gridStrokeWidth, setGridStrokeWidth] = useState<number>(1);
  const [gridStrokeColor, setGridStrokeColor] = useState<string>("#000000");
  const [isGridFixed, setIsGridFixed] = useState<boolean>(false);
  const [isGridVisible, setIsGridVisible] = useState<boolean>(true);
  const [isPanZoomable, setIsPanZoomable] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const {
    prompt,
    step,
    isRightBarOpen: isRightBar,
    messages,
  } = useAppSelector((state) => state.aiAssistant);
  const userId = useAppSelector((state) => state.user.userId);
  const { selectedDottingData, setSelectedDottingData } =
    useContext(GenAiDataContext);

  const {
    addHoverPixelChangeListener,
    removeHoverPixelChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
    addStrokeEndListener,
    removeStrokeEndListener,
  } = useHandlers(ref);
  const { setIndicatorPixels, colorPixels, downloadImage } = useDotting(ref);
  const { changeBrushTool } = useBrush(ref);
  const { data } = useData(ref);

  const hoveredPixel = useRef<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  const handleHoverPixelChangeHandler =
    useCallback<CanvasHoverPixelChangeHandler>(
      (params) => {
        if (params.indices === null) {
          return;
        }

        const { rowIndex, columnIndex } = params.indices;
        hoveredPixel.current = {
          rowIndex,
          columnIndex,
        };
        if (selectedDottingData === null) {
          return;
        }
        const tempIndicators: Array<PixelModifyItem> = [];
        const widthOffset = Math.floor(selectedDottingData?.width / 2);
        const heightOffset = Math.floor(selectedDottingData?.height / 2);
        Array.from(selectedDottingData.data.entries()).forEach(
          (columnsData) => {
            const [rowKey, columns] = columnsData;
            Array.from(columns.entries()).forEach((column) => {
              const [columnKey, pixel] = column;
              if (!pixel.color) {
                return;
              }
              tempIndicators.push({
                rowIndex: rowKey + rowIndex - heightOffset,
                columnIndex: columnKey + columnIndex - widthOffset,
                color: pixel.color,
              });
            });
          }
        );
        changeBrushTool(BrushTool.NONE);
        setIndicatorPixels(tempIndicators);
      },

      [hoveredPixel, setIndicatorPixels, selectedDottingData, changeBrushTool]
    );

  useEffect(() => {
    const escapeKeyEvent = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedDottingData(null);
        setIndicatorPixels([]);
        changeBrushTool(BrushTool.DOT);
      }
    };
    window.addEventListener("keydown", escapeKeyEvent);
    return () => {
      window.removeEventListener("keydown", escapeKeyEvent);
    };
  }, [setSelectedDottingData, setIndicatorPixels, changeBrushTool]);

  useEffect(() => {
    const colorIndicators = (event: Event) => {
      if (!selectedDottingData) {
        return;
      }
      if (hoveredPixel.current !== null) {
        console.log(hoveredPixel.current);
        const tempIndicators: Array<PixelModifyItem> = [];
        const widthOffset = Math.floor(selectedDottingData.width / 2);
        const heightOffset = Math.floor(selectedDottingData.height / 2);
        const { rowIndex, columnIndex } = hoveredPixel.current;
        Array.from(selectedDottingData.data.entries()).forEach(
          (columnsData) => {
            const [rowKey, columns] = columnsData;
            Array.from(columns.entries()).forEach((column) => {
              const [columnKey, pixel] = column;
              if (!pixel.color) {
                return;
              }
              tempIndicators.push({
                rowIndex: rowKey + rowIndex - heightOffset,
                columnIndex: columnKey + columnIndex - widthOffset,
                color: pixel.color,
              });
            });
          }
        );
        colorPixels(tempIndicators);
        // const neighboringPixels = getNeighboringPixels({
        //   rowIndex,
        //   columnIndex,
        //   data,
        // });
        // const body: PostTrackStrokeBodyDto = {
        //   userId: userId,
        //   strokedPixels: tempIndicators,
        //   strokeTool: "GENAI",
        //   strokeStartNeighboringPixels: neighboringPixels,
        //   createdAt: new Date(),
        // };
        // axios.post("/api/track/stroke", body).then((res) => {
        //   console.log(res.data);
        // });

        setSelectedDottingData(null);
        setIndicatorPixels([]);
        // changeBrushTool(BrushTool.DOT);
      }
      // this is here since coloring a pixel will trigger a mousedown event
      event.stopImmediatePropagation();
      event.stopPropagation();
      changeBrushTool(BrushTool.DOT);
    };
    addCanvasElementEventListener("mousedown", colorIndicators);
    return () => {
      removeCanvasElementEventListener("mousedown", colorIndicators);
    };
  }, [
    changeBrushTool,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
    setIndicatorPixels,
    setSelectedDottingData,
    hoveredPixel,
    colorPixels,
    selectedDottingData,
    data,
    userId,
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

  const handleStrokeEndHandler = useCallback<CanvasStrokeEndHandler>(
    ({ strokeTool, strokedPixels }) => {
      if (hoveredPixel.current === null) {
        return;
      }
      // const { rowIndex, columnIndex } = hoveredPixel.current;
      // const neighboringPixels = getNeighboringPixels({
      //   rowIndex,
      //   columnIndex,
      //   data,
      // });
      // const body: PostTrackStrokeBodyDto = {
      //   userId: "dotting-service-" + userId,
      //   createdAt: new Date(),
      //   strokeTool,
      //   strokedPixels,
      //   strokeStartNeighboringPixels: neighboringPixels,
      // };
      // axios.post("/api/track/stroke", body).then((res) => {
      //   console.log(res.data);
      // });
    },
    [userId, data, hoveredPixel]
  );

  useEffect(() => {
    addStrokeEndListener(handleStrokeEndHandler);
    return () => {
      removeStrokeEndListener(handleStrokeEndHandler);
    };
  }, [addStrokeEndListener, removeStrokeEndListener, handleStrokeEndHandler]);

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
        // we will call diffusion api two times to get two images
        const responses = await Promise.all([
          axios.post(
            `${DIFFUSION_URL}`,
            { prompt },
            { responseType: "arraybuffer" }
          ),
          axios.post(
            `${DIFFUSION_URL}`,
            { prompt },
            { responseType: "arraybuffer" }
          ),
        ]);

        const tempImgUrls: Array<string> = [];
        for (const response of responses) {
          const img = response.data;
          const buffer = Buffer.from(img, "utf-8");
          const bufferData = buffer.toJSON().data;
          const view = new Uint8Array(bufferData);
          const blob = new Blob([view], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          tempImgUrls.push(url);
        }

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
            content: "How would you like to create your character?",
          },
        ])
      );
    } else if (step === 2) {
      // dispatch(
      //   addMessages([
      //     {
      //       type: ChatType.TEXT,
      //       From: From.AI,
      //       content: "Please input your prompt.",
      //     },
      //   ])
      // );
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
            gridStrokeColor={gridStrokeColor}
            gridStrokeWidth={gridStrokeWidth}
            isGridFixed={isGridFixed}
            isPanZoomable={isPanZoomable}
            isGridVisible={isGridVisible}
            style={{ border: "none" }}
            height={"100vh"}
            initLayers={[
              {
                id: "layer1",
                data: Array(30)
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
                  }),
              },
            ]}
          />

          {isRightBar ? (
            <RightBar onSubmit={callImage} />
          ) : (
            <Button
              borderRadius="16"
              onClick={() => {
                dispatch(setIsRightBarOpen(true));
                console.log(userId);
              }}
              style={{ position: "absolute", right: "20px", top: "24px" }}
              colorScheme="teal"
            >
              Open Dotting Ai Assistant
            </Button>
          )}
          <Header downloadImage={downloadImage} isGridVisible={isGridVisible} />
          <Toolbar
            ref={ref}
            isGridFixed={isGridFixed}
            isPanZoomable={isPanZoomable}
            isGridVisible={isGridVisible}
            gridStrokeColor={gridStrokeColor}
            gridStrokeWidth={gridStrokeWidth}
            setIsGridFixed={setIsGridFixed}
            setIsPanZoomable={setIsPanZoomable}
            setIsGridVisible={setIsGridVisible}
            setGridStrokeWidth={setGridStrokeWidth}
            setGridStrokeColor={setGridStrokeColor}
          />
        </div>
      </main>
    </>
  );
}
