# Audio Shift Detection

Rendering pipelines can introduce audio shift — your source video's cut points may not line up with the rendered output.

## Why It Happens

| Pipeline | Typical shift |
|----------|--------------|
| MoviePy | 50–150ms audio delay |
| FFmpeg direct | ~0ms |
| Remotion (Chrome-based) | ~0ms |

## Detection Method

1. Analyze waveform of SOURCE video at known cut points (silence expected)
2. Render the video
3. Analyze waveform of RENDERED video at the same timeline positions
4. If rendered shows voice where source shows silence → shift detected

```bash
# Extract audio from source and rendered for comparison
bunx remotion ffmpeg -i source.mp4  -vn -acodec pcm_s16le -ar 16000 -ac 1 source.wav
bunx remotion ffmpeg -i rendered.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 rendered.wav
```

Then compare RMS at expected cut positions in both files.

## Compensation

Once shift is detected (e.g., 80ms), adjust all cut points:
- `actual_cut = intended_cut - shift`

Apply the adjustment globally to all segments, then re-render and validate.
