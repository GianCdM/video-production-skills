# Thematic / Intercalated Editing

For multi-speaker videos (tributes, compilations, interviews).

## Narrative Act Structure

Instead of playing each person sequentially, split content across thematic acts. This creates a more engaging, documentary-style video:

| Act | Theme | What to look for |
|-----|-------|-----------------|
| 1 — Arrival/Introduction | How they met, first impressions | Greetings, "when I first met..." |
| 2 — Character/Personality | Who the person IS | Anecdotes, humor, traits |
| 3 — Impact/Legacy | Professional contributions | "what they built", "changed the way we..." |
| 4 — Farewell/Wishes | Gratitude, good luck | "thank you", "good luck with..." |

## Mapping Content to Acts

For each person:
1. Read their full transcription
2. Identify sentence boundaries (periods, complete thoughts)
3. Map each sentence/block to the appropriate act
4. Record: `{ file, start_sec, end_sec, act, showLowerThird }`

## Lower-Thirds

Show name + role only on the **first appearance** of each person.

### Option A — Remotion-native (recommended)

Build as a React component using `@remotion/transitions` for fade-in/out. Load `remotion-best-practices/rules/text-animations.md` for text animation patterns and `rules/measuring-text.md` to ensure the text doesn't overflow.

```tsx
// Typical lower-third pattern
const LowerThird = ({ name, role, durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: 'absolute', bottom: 80, left: 60 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>{name}</div>
        <div style={{ fontSize: 18, color: '#ccc' }}>{role}</div>
        <div style={{ height: 3, background: '#brand-color', marginTop: 4 }} />
      </div>
    </AbsoluteFill>
  );
};
```

### Option B — Pixel-perfect image (PIL/Canvas)

Use PIL/Canvas to generate PNG overlays if you need exact brand alignment. Load as `<Img>` in Remotion.

### Guidelines (both options)
- Fade in after 0.3s (≈9 frames at 30fps)
- Display for ~4s (≈120 frames)
- Fade out over 0.3s

## Dynamic Composition Duration

When segment count or duration varies, use `calculateMetadata` to set composition duration dynamically. Load `remotion-best-practices/rules/calculate-metadata.md` for implementation.
