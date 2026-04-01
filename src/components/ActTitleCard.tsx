import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IFOOD_RED } from "../data/segments";

interface ActTitleCardProps {
  actNumber: number;
  actTitle: string;
}

const ACT_TITLES: Record<number, string> = {
  1: "A Chegada",
  2: "O Cara",
  3: "O Impacto",
  4: "Valeu, Paga!",
};

export const ACT_TITLE_DURATION_SEC = 2.5;

export const ActTitleCard: React.FC<ActTitleCardProps> = ({
  actNumber,
  actTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeInEnd = Math.round(fps * 0.5);
  const fadeOutStart = durationInFrames - Math.round(fps * 0.5);

  const opacity = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Line grows from center
  const lineWidth = interpolate(
    frame,
    [Math.round(fps * 0.2), Math.round(fps * 0.6)],
    [0, 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtitle slides up
  const subtitleOffset = interpolate(
    frame,
    [Math.round(fps * 0.3), Math.round(fps * 0.7)],
    [15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const subtitleOpacity = interpolate(
    frame,
    [Math.round(fps * 0.3), Math.round(fps * 0.7)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Act number */}
        <div
          style={{
            color: IFOOD_RED,
            fontSize: 16,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Ato {actNumber}
        </div>

        {/* Red line */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            backgroundColor: IFOOD_RED,
            borderRadius: 2,
          }}
        />

        {/* Act title */}
        <div
          style={{
            color: "white",
            fontSize: 42,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 700,
            letterSpacing: -0.5,
            textAlign: "center",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleOffset}px)`,
          }}
        >
          {actTitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { ACT_TITLES };
