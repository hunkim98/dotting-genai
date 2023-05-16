import { DottingData, PixelModifyItem } from "dotting";

const neighborMaxDegree = 2;

export function getNeighboringPixels({
  rowIndex,
  columnIndex,
  data,
}: {
  rowIndex: number;
  columnIndex: number;
  data: DottingData;
}) {
  const neighboringPixels: Array<PixelModifyItem> = [];
  for (let i = -2; i <= neighborMaxDegree; i++) {
    for (let j = -2; j <= neighborMaxDegree; j++) {
      const rowIndexToCheck = rowIndex + i;
      const columnIndexToCheck = columnIndex + j;
      const doesColorExist =
        data.get(rowIndexToCheck) &&
        data.get(rowIndexToCheck)!.get(columnIndexToCheck)?.color;
      if (doesColorExist) {
        neighboringPixels.push({
          rowIndex: rowIndexToCheck,
          columnIndex: columnIndexToCheck,
          color: data.get(rowIndexToCheck)!.get(columnIndexToCheck)!.color,
        });
      } else {
        neighboringPixels.push({
          rowIndex: rowIndexToCheck,
          columnIndex: columnIndexToCheck,
          color: "",
        });
      }
    }
  }
  return neighboringPixels;
}
