import { BrushTool, PixelModifyItem } from "dotting";

export interface PostTrackStrokeBodyDto {
  strokeTool: BrushTool;
  strokedPixels: Array<PixelModifyItem>;
  strokeStartNeighboringPixels: Array<PixelModifyItem>;
}
