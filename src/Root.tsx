import React from "react";
import { Composition } from "remotion";
import { HomenagemPaga } from "./compositions/HomenagemPaga";
import { FPS, WIDTH, HEIGHT, totalDurationFrames } from "./data/segments";

export const Root: React.FC = () => {
  const durationInFrames = totalDurationFrames();

  return (
    <>
      <Composition
        id="HomenagemPaga"
        component={HomenagemPaga}
        durationInFrames={durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
