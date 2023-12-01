import { BRUSH_PATTERN_ELEMENT } from "dotting";

export type BrushPattern = Array<Array<BRUSH_PATTERN_ELEMENT>>;

const sizeOneBrush: BrushPattern = [[1]];

const sizeTwoBrush: BrushPattern = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
];

const sizeThreeBrush: BrushPattern = [
  [0, 1, 1, 0],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [0, 1, 1, 0],
];

const sizeFourBrush: BrushPattern = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
];

const sizeFiveBrush: BrushPattern = [
  [0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 0, 0],
];

const sizeSixBrush: BrushPattern = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
];

export const brushPatterns: Array<BrushPattern> = [
  sizeOneBrush,
  sizeTwoBrush,
  sizeThreeBrush,
  sizeFourBrush,
  sizeFiveBrush,
  sizeSixBrush,
];
