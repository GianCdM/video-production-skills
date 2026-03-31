import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { Segment, FPS, videoSrc } from "../data/segments";
import { LowerThird } from "./LowerThird";

interface TestimonialSegmentProps {
  segment: Segment;
}

export const TestimonialSegment: React.FC<TestimonialSegmentProps> = ({
  segment,
}) => {
  const startFrom = Math.round(segment.start * FPS);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={videoSrc(segment.file)}
        startFrom={startFrom}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {segment.showLowerThird && (
        <LowerThird name={segment.name} role={segment.role} />
      )}
    </AbsoluteFill>
  );
};
