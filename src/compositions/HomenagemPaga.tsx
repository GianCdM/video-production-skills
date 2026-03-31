import React from "react";
import { AbsoluteFill, Audio, staticFile, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  SEGMENTS,
  FPS,
  FADE_FRAMES,
  INTRO_DURATION_SEC,
  OUTRO_DURATION_SEC,
  ACT_TITLE_DURATION_SEC,
  segmentDurationFrames,
} from "../data/segments";
import { TitleCard } from "../components/TitleCard";
import { TestimonialSegment } from "../components/TestimonialSegment";
import { ActTitleCard, ACT_TITLES } from "../components/ActTitleCard";

export const HomenagemPaga: React.FC = () => {
  const introFrames = INTRO_DURATION_SEC * FPS;
  const outroFrames = OUTRO_DURATION_SEC * FPS;
  const actTitleFrames = Math.round(ACT_TITLE_DURATION_SEC * FPS);

  // Build timeline: intro → (act title + segments)... → outro
  let currentFrame = introFrames;
  const timeline: Array<
    | { type: "act"; act: number; start: number }
    | { type: "segment"; index: number; start: number; frames: number }
  > = [];

  let lastAct = -1;
  for (let i = 0; i < SEGMENTS.length; i++) {
    const seg = SEGMENTS[i];

    // Insert act title card when act changes
    if (seg.act !== lastAct) {
      timeline.push({ type: "act", act: seg.act, start: currentFrame });
      currentFrame += actTitleFrames;
      lastAct = seg.act;
    }

    const segFrames = segmentDurationFrames(seg);
    timeline.push({ type: "segment", index: i, start: currentFrame, frames: segFrames });
    currentFrame += segFrames;
  }

  const outroStart = currentFrame;

  // Music starts 1.3s after outro begins
  const musicStart = outroStart + Math.round(FPS * 1.3);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* INTRO TITLE CARD */}
      <Sequence from={0} durationInFrames={introFrames}>
        <TitleCard
          title="Valeu, Paga!"
          subtitle="Multicategorias agradece  ·  iFood"
          variant="intro"
        />
      </Sequence>

      {/* TIMELINE: act titles + testimonial segments */}
      {timeline.map((item, idx) => {
        if (item.type === "act") {
          return (
            <Sequence
              key={`act-${item.act}`}
              from={item.start}
              durationInFrames={actTitleFrames}
            >
              <ActTitleCard
                actNumber={item.act}
                actTitle={ACT_TITLES[item.act] || `Ato ${item.act}`}
              />
            </Sequence>
          );
        }

        const segment = SEGMENTS[item.index];
        return (
          <Sequence
            key={`seg-${item.index}`}
            from={item.start}
            durationInFrames={item.frames}
          >
            <DipToBlackWrapper durationInFrames={item.frames}>
              <TestimonialSegment segment={segment} />
            </DipToBlackWrapper>
          </Sequence>
        );
      })}

      {/* OUTRO TITLE CARD */}
      <Sequence from={outroStart} durationInFrames={outroFrames}>
        <TitleCard
          title="Voa, Paga! 🚀"
          subtitle="Boa sorte nos novos desafios!  ·  iFood"
          variant="outro"
        />
      </Sequence>

      {/* Background music */}
      <Sequence from={musicStart}>
        <Audio
          src={staticFile("Voa-Paga.mp3")}
          volume={0.3}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Wraps a segment with fade-in and fade-out (dip-to-black) */
const DipToBlackWrapper: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};
