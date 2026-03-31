import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IFOOD_RED } from "../data/segments";

interface LowerThirdProps {
  name: string;
  role: string;
}

export const LowerThird: React.FC<LowerThirdProps> = ({ name, role }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Dynamic timing based on segment duration
  const segDurationSec = durationInFrames / fps;
  const fadeInStart = Math.round(fps * 0.3);
  const fadeInEnd = Math.round(fps * 1.0);

  // Hold lower third for up to 5s, but fade out 0.8s before segment ends
  const maxDisplayEnd = Math.round(fps * 4.5);
  const safeEnd = durationInFrames - Math.round(fps * 0.8);
  const displayEnd = Math.min(maxDisplayEnd, safeEnd - Math.round(fps * 0.5));
  const fadeOutEnd = Math.min(maxDisplayEnd + Math.round(fps * 0.5), safeEnd);

  // Don't show if segment is too short
  if (segDurationSec < 2) return null;

  const slideDistance = 20;

  const opacity = interpolate(
    frame,
    [fadeInStart, fadeInEnd, displayEnd, fadeOutEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(
    frame,
    [fadeInStart, fadeInEnd],
    [slideDistance, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const barWidth = interpolate(
    frame,
    [fadeInStart, fadeInEnd],
    [0, 4],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 60,
          opacity,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 12,
        }}
      >
        {/* Red accent bar */}
        <div
          style={{
            width: barWidth,
            backgroundColor: IFOOD_RED,
            borderRadius: 2,
            minHeight: "100%",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              color: "white",
              fontSize: 28,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 700,
              textShadow: "0 2px 8px rgba(0,0,0,0.7)",
              lineHeight: 1.2,
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 18,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 400,
              textShadow: "0 1px 6px rgba(0,0,0,0.7)",
              lineHeight: 1.2,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
