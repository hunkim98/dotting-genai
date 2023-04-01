import { DottingData } from "@/../dotting/build/src";

export function removeWhiteBg(data: DottingData) {
  if (data.size === 0) return;
  data.forEach((row) => {
    row.forEach((pixel) => {
      const [r, g, b] = pixel.color
        .replace("rgba(", "")
        .replace(")", "")
        .split(",")
        .map((c) => parseInt(c));
      if (r === 255 && g === 255 && b === 255) {
        pixel.color = "rgba(0,0,0,0)";
      }
    });
  });
}
