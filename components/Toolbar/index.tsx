import {
  forwardRef,
  ForwardedRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DottingRef, useBrush, useDotting } from "dotting";
import Image from "next/image";

import dot from "@/public/dot-icon.svg";
import undoIcon from "@/public/undo-icon.svg";
import redoIcon from "@/public/redo-icon.svg";
import eraser from "@/public/eraser-icon.svg";
import paintBucket from "@/public/paint-bucket-icon.svg";

import {
  ViewIcon,
  UnlockIcon,
  DeleteIcon,
  ArrowUpIcon,
  SettingsIcon,
  ArrowUpDownIcon,
} from "@chakra-ui/icons";
import {
  Menu,
  Flex,
  Button,
  Tooltip,
  Checkbox,
  MenuItem,
  MenuList,
  IconButton,
  MenuButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";

export enum BrushMode {
  DOT = "dot",
  ERASER = "eraser",
  PAINT_BUCKET = "paint_bucket",
}

interface ToolbarProps {
  isGridFixed: boolean;
  isPanZoomable: boolean;
  isGridVisible: boolean;
  gridStrokeColor: string;
  gridStrokeWidth: number;
  setIsGridFixed: (v: boolean) => void;
  setIsPanZoomable: (v: boolean) => void;
  setIsGridVisible: (v: boolean) => void;
  setGridStrokeColor: (v: string) => void;
  setGridStrokeWidth: (v: number) => void;
}

const Toolbar = forwardRef(function ToolBarInner(
  {
    isGridFixed,
    isPanZoomable,
    isGridVisible,
    gridStrokeColor,
    gridStrokeWidth,
    setIsGridFixed,
    setIsPanZoomable,
    setIsGridVisible,
    setGridStrokeColor,
    setGridStrokeWidth,
  }: ToolbarProps,
  ref: ForwardedRef<DottingRef>
) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isSelected, setIsSelected] = useState({
    dot: true,
    eraser: false,
    paint_bucket: false,
  });
  //@ts-ignore
  const { undo, redo, clear } = useDotting(ref);
  const { changeBrushColor, changeBrushMode, brushMode, brushColor } =
    //@ts-ignore
    useBrush(ref);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      changeBrushColor.bind(null, e.target.value)();
    },
    []
  );

  const handleIsGridVisibleChange = useCallback(
    (e: { target: { checked: boolean } }) => {
      setIsGridVisible(e.target.checked);
    },
    [setIsGridVisible]
  );

  const handleIsPanZoomableChange = useCallback(
    (e: { target: { checked: boolean } }) => {
      setIsPanZoomable(e.target.checked);
    },
    []
  );

  const handleIsGridFixedChange = useCallback(
    (e: { target: { checked: boolean } }) => {
      setIsGridFixed(e.target.checked);
    },
    []
  );

  useEffect(() => {
    if (brushMode === BrushMode.DOT) {
      setIsSelected({
        dot: true,
        eraser: false,
        paint_bucket: false,
      });
    } else if (brushMode === BrushMode.ERASER) {
      setIsSelected({
        dot: false,
        eraser: true,
        paint_bucket: false,
      });
    } else if (brushMode === BrushMode.PAINT_BUCKET) {
      setIsSelected({
        dot: false,
        eraser: false,
        paint_bucket: true,
      });
    }
  }, [brushMode]);
  return (
    <Flex
      width="424px"
      height="auto"
      position={"absolute"}
      style={{
        left: "50%",
        bottom: "52px",
        transform: "translateX(-50%)",
        filter: "drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.20))",
      }}
    >
      <Flex
        width="384px"
        height="42px"
        style={{
          borderRadius: "6px",
          background: "#fff",
          border: "1px solid #E4E7EC",
        }}
      >
        {/* BRUSH COLOR */}
        <Tooltip label="select brush color" placement="top">
          <Button
            width="64px"
            bg="white.500"
            _hover={{ bg: "gray.200" }}
            borderRadius={"6px 0 0 6px"}
            borderRight="1px solid #E4E7EC"
            p="0"
          >
            <input
              type="color"
              value={brushColor}
              onChange={handleColorChange}
            />
          </Button>
        </Tooltip>

        {/* BRUSH MODE */}
        <Tooltip label="dot" placement="top">
          <Button
            width="64px"
            bg={isSelected["dot"] ? "#E4E4E4" : "white.500"}
            _hover={{ bg: "gray.200" }}
            borderRadius="0"
            borderRight="1px solid #E4E7EC"
            onClick={() => {
              changeBrushMode(BrushMode.DOT);
            }}
          >
            <Image src={dot} width={24} height={24} alt="dot" />
          </Button>
        </Tooltip>
        <Tooltip label="paint bucket" placement="top">
          <Button
            width="64px"
            bg={isSelected["paint_bucket"] ? "#E4E4E4" : "white.500"}
            _hover={{ bg: "gray.200" }}
            borderRadius="0"
            borderRight="1px solid #E4E7EC"
            onClick={() => {
              changeBrushMode(BrushMode.PAINT_BUCKET);
            }}
          >
            <Image src={paintBucket} width={23} height={23} alt="paint" />
          </Button>
        </Tooltip>
        <Tooltip label="eraser" placement="top">
          <Button
            width="64px"
            bg={isSelected["eraser"] ? "#E4E4E4" : "white.500"}
            _hover={{ bg: "gray.200" }}
            borderRadius="0"
            borderRight="1px solid #E4E7EC"
            onClick={() => {
              changeBrushMode(BrushMode.ERASER);
            }}
          >
            <Image src={eraser} width={20} height={20} alt="eraser" />
          </Button>
        </Tooltip>

        {/* UNDO, REDO */}
        <Tooltip label="undo" placement="top" closeOnClick={false}>
          <Button
            width="64px"
            bg="white.500"
            _hover={{ bg: "gray.200" }}
            borderRadius="0"
            borderRight="1px solid #E4E7EC"
            onClick={undo}
          >
            <Image src={undoIcon} width={24} height={24} alt="undo" />
          </Button>
        </Tooltip>
        <Tooltip label="redo" placement="top" closeOnClick={false}>
          <Button
            width="64px"
            bg="white.500"
            _hover={{ bg: "gray.200" }}
            borderRadius={"0 6px 6px 0"}
            onClick={redo}
          >
            <Image src={redoIcon} width={24} height={24} alt="redo" />
          </Button>
        </Tooltip>
      </Flex>

      {/* SHOW MORE BUTTON */}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          variant="outline"
          borderRadius={"300px"}
          borderRight="1px solid #E4E7EC"
          ml={3}
          background="#fff"
        >
          {"···"}
        </MenuButton>

        {/* Grid stroke width */}
        <MenuList fontSize={14} justifyContent={"center"}>
          <Flex
            height="40px"
            px="4"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <ArrowUpIcon />
            <Flex ml="2">Grid stroke width</Flex>
            <input
              type="number"
              style={{
                border: "1px solid #c6c6c6",
                borderRadius: "5px",
                paddingLeft: "7px",
                marginLeft: 25,
              }}
              min={1}
              max={10}
              step={1}
              value={gridStrokeWidth}
              onChange={(e) => setGridStrokeWidth(Number(e.target.value))}
            />
          </Flex>

          {/* Grid Stroke Color */}
          <Flex
            px="4"
            height="40px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <SettingsIcon />
              <Flex ml="3">Grid Stroke Color</Flex>
            </Flex>
            <input
              type="color"
              value={gridStrokeColor}
              onChange={(e) => setGridStrokeColor(e.target.value)}
            />
          </Flex>

          {/* Is grid visible */}
          <Flex
            px="4"
            height="40px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <ViewIcon />
              <Flex ml="3">Is grid visible</Flex>
            </Flex>
            <Checkbox
              colorScheme="green"
              defaultChecked
              checked={isGridVisible}
              onChange={handleIsGridVisibleChange}
            ></Checkbox>
          </Flex>

          {/* Is panZoom able */}
          <Flex
            px="4"
            height="40px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <ArrowUpDownIcon />
              <Flex ml="3">Is panZoom able</Flex>
            </Flex>
            <Checkbox
              colorScheme="green"
              defaultChecked
              checked={isPanZoomable}
              onChange={handleIsPanZoomableChange}
            ></Checkbox>
          </Flex>

          {/* Is grid fixed */}
          <Flex
            px="4"
            height="40px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <UnlockIcon />
              <Flex ml="3">Is grid fixed</Flex>
            </Flex>
            <Checkbox
              colorScheme="green"
              defaultChecked={false}
              checked={isGridFixed}
              onChange={handleIsGridFixedChange}
            ></Checkbox>
          </Flex>

          {/* clear canvas */}
          <MenuItem onClick={onOpen} pl="4" height="40px" icon={<DeleteIcon />}>
            clear canvas
          </MenuItem>
          <>
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              isOpen={isOpen}
              isCentered
            >
              <AlertDialogOverlay />

              <AlertDialogContent>
                <AlertDialogHeader>DOTTING CLEAR</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                  Are you sure you want to reset it?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    No
                  </Button>
                  <Button
                    colorScheme="teal"
                    ml={3}
                    onClick={() => {
                      clear();
                      onClose();
                    }}
                  >
                    Yes
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        </MenuList>
      </Menu>
    </Flex>
  );
});

export default Toolbar;
