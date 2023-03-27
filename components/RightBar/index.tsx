import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import React from "react";

export const RightBar = () => {
  const isReceiving = useAppSelector((state) => state.genAi.isReceiving);
  const pixelatedData = useAppSelector((state) => state.genAi.pixelatedData);
  return (
    <div>
      <h3>Generated Pixels</h3>
      <div
        style={{
          minWidth: 200,
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {pixelatedData.map((data, index) => {
          console.log(data.imgUrl, index);
          return (
            <Image
              src={data.imgUrl}
              key={data.imgUrl}
              // fill
              style={{ marginBottom: 10 }}
              alt={""}
              width={180}
              height={180}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RightBar;
