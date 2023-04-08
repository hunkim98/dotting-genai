import { DottingData, PixelModifyItem } from "dotting";

/**
 * Asynchronously pixelates an image
 * @param imageUrl
 * @param pixelationFactor
 * @returns
 */
export async function pixelateImage(
  imageUrl: string,
  pixelationFactor: number
): Promise<{
  imgUrl: string;
  data: DottingData;
  width: number;
  height: number;
}> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  return new Promise((resolve, reject) => {
    try {
      const imageObject = new Image();
      imageObject.crossOrigin = "anonymous";
      //   imageObject.crossOrigin = "Anonymous";/
      // imageObject.crossOrigin = "use-credentials";
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
        const maxPixelEdgeCount = pixelationFactor * 10;
        const pixelSkipAmount = Math.floor(
          Math.max(originalWidth, originalHeight) / maxPixelEdgeCount
        );
        let validRowCount = 0;
        let validColumnCount = 0;
        if (pixelationFactor !== 0) {
          for (let y = 0; y < originalHeight; y += pixelSkipAmount) {
            rowIndex++;
            pixelData.set(rowIndex, new Map());
            let isCurrentColumnValid = false;
            let currentRowCount = 0;
            for (let x = 0; x < originalWidth; x += pixelSkipAmount) {
              // extracting the position of the sample pixel
              const pixelIndexPosition = (x + y * originalWidth) * 4;
              // drawing a square replacing the current pixels
              const red = originalImageData[pixelIndexPosition];
              const green = originalImageData[pixelIndexPosition + 1];
              const blue = originalImageData[pixelIndexPosition + 2];
              const alpha = originalImageData[pixelIndexPosition + 3];
              let color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
              if (alpha !== 0) {
                isCurrentColumnValid = true;
                currentRowCount++;
                context.fillStyle = color;
                context.fillRect(x, y, pixelSkipAmount, pixelSkipAmount);
                pixelData.get(rowIndex)!.set(columnIndex, { color });
              }

              if (currentRowCount > validRowCount) {
                validRowCount = currentRowCount;
              }
              columnIndex++;
            }
            if (isCurrentColumnValid) {
              validColumnCount++;
            }
            columnIndex = 0;
          }
        }
        resolve({
          imgUrl: canvas.toDataURL(),
          data: pixelData,
          width: Math.floor(originalWidth / pixelSkipAmount),
          height: Math.floor(originalHeight / pixelSkipAmount),
        });
      };
      imageObject.onerror = (error) => {
        console.log(error, "This is from pixelateImage.ts");
        reject(error);
      };
    } catch (error) {
      console.log(error, "This is from pixelateImage.ts");
      reject(error);
    }
  });
}
