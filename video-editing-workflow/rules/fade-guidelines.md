# Fade Duration Guidelines

Fade durations affect how transitions feel. Use these as defaults; adjust based on triad analysis results.

## Reference Table

| Context | Recommended fade | Why |
|---------|-----------------|-----|
| Between different people | 0.4s | Natural "scene change" feel |
| Between segments of same person | 0.3s | Lighter, less disruptive |
| First segment (intro → first person) | 0.5s | Smooth entry |
| Last segment (last person → outro) | 0.5s | Smooth exit |
| Dip-to-black (no overlap) | padding=0 | Eliminates voice overlap entirely |

## Implementation in Remotion

Use `@remotion/transitions` with `TransitionSeries` and `fade()`:

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={segmentAFrames}>
    <SegmentA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
  />
  <TransitionSeries.Sequence durationInFrames={segmentBFrames}>
    <SegmentB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Load `remotion-best-practices/rules/transitions.md` for more transition types and timing options.

## Dip-to-Black

For hard cuts between people (no audio overlap), use a black frame instead of a crossfade:

```tsx
<TransitionSeries.Transition
  presentation={fade()}
  timing={linearTiming({ durationInFrames: 12 })} // 0.4s at 30fps
/>
```

The dip-to-black happens naturally when you fade out to black and fade in from black with no audio overlap (`padding=0`).
