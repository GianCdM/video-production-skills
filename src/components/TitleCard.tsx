import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IFOOD_RED } from "../data/segments";

interface TitleCardProps {
  title: string;
  subtitle: string;
  variant?: "intro" | "outro";
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  variant = "intro",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeInEnd = Math.round(fps * 0.8);
  const fadeOutStart = durationInFrames - Math.round(fps * 0.8);

  const opacity = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleScale = interpolate(frame, [0, fadeInEnd], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [fadeInEnd, fadeInEnd + Math.round(fps * 0.5)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Red underline width animation
  const lineWidth = interpolate(
    frame,
    [Math.round(fps * 0.3), fadeInEnd],
    [0, 120],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
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
          gap: 16,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: variant === "outro" ? 52 : 60,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 800,
            letterSpacing: -1,
            textAlign: "center",
          }}
        >
          {title}
        </div>

        {/* Red underline */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: IFOOD_RED,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 24,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 400,
            opacity: subtitleOpacity,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
