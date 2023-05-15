import { BrushTool, PixelModifyItem } from "dotting";

export interface PostTrackStrokeBodyDto {
  userId: string;
  createdAt: Date;
  strokeTool: BrushTool;
  strokedPixels: Array<PixelModifyItem>;
  strokeStartNeighboringPixels: Array<PixelModifyItem>;
}
