import { DottingData } from "dotting";
/**
 * Asynchronously pixelates an image
 * @param imageUrl
 * @param pixelationFactor
 * @returns
 */
export async function pixelateImage(
  imageUrl: string,
  pixelationFactor: number
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  return new Promise((resolve) => {
    const imageObject = new Image();
    imageObject.src = imageUrl;
    imageObject.onload = () => {
      const originalWidth = imageObject.width;
      const originalHeight = imageObject.height;
      const canvasWidth = originalWidth;
      const canvasHeight = originalHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context.drawImage(imageObject, 0, 0, originalWidth, originalHeight);
      const originalImageData = context.getImageData(
        0,
        0,
        originalWidth,
        originalHeight
      ).data;
      const pixelData: DottingData = new Map();
      let rowIndex = 0;
      let columnIndex = 0;
      if (pixelationFactor !== 0) {
        for (let y = 0; y < originalHeight; y += pixelationFactor) {
          rowIndex++;
          pixelData.set(rowIndex, new Map());
          for (let x = 0; x < originalWidth; x += pixelationFactor) {
            // extracting the position of the sample pixel
            const pixelIndexPosition = (x + y * originalWidth) * 4;
            // drawing a square replacing the current pixels
            const red = originalImageData[pixelIndexPosition];
            const green = originalImageData[pixelIndexPosition + 1];
            const blue = originalImageData[pixelIndexPosition + 2];
            const alpha = originalImageData[pixelIndexPosition + 3];
            const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            context.fillStyle = color;
            context.fillRect(x, y, pixelationFactor, pixelationFactor);
            pixelData.get(rowIndex)!.set(columnIndex, { color });
            columnIndex++;
          }
          columnIndex = 0;
        }
      }
      resolve({ imgUrl: canvas.toDataURL(), data: pixelData });
    };
  });
}
