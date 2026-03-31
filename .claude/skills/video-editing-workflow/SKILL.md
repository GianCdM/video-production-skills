---
name: video-editing-workflow
description: Workflow for video production — from motion graphics to multi-speaker testimonials. Covers project setup, video intake, transcription, precision cutting with triad validation (waveform × transcription × timeline), and quality assurance.
metadata:
  tags: video, editing, workflow, remotion, waveform, transcription, testimonial, motion-graphics
---

# Video Editing Workflow

Comprehensive workflow for video production using Remotion (React). Covers all video types — from pure motion graphics to real footage editing with precision audio sync.

## 0. When to Use This Skill

Start here. Identify your video type:

### Type A — Motion Graphics / Animation (no imported footage)
Examples: promotional videos, explainers, animated presentations.
- Skip sections 1, 3, 4, 5, 6, 7 (no real footage to analyze)
- Use Remotion best-practices skill for components, animations, transitions
- Focus on: scene structure, timing, visual design

### Type B — Real Footage Editing (imported video/audio)
Examples: testimonial compilations, tribute videos, interview montages.
- Follow the FULL pipeline below (sections 1-10)
- Critical: triad analysis (section 3) is mandatory for every cut point
- Always transcribe before editing

### Type C — Mixed (footage + motion graphics)
Examples: event recap with animated titles, documentary with infographics.
- Follow full pipeline for footage segments
- Use Remotion best-practices for animated segments
- Pay special attention to transitions between footage and graphics

### Universal rules (all types):
1. Always use Remotion Studio (`npm start`) for real-time preview — never render blindly
2. Structure videos in scenes/acts before writing any code
3. Prepare all assets in `public/` before starting
4. Iterate scene by scene, not the whole video at once

## 1. Video Intake Pipeline (Types B & C only)

When receiving new video files:

1. **Copy** to project directory with standardized naming: `{PersonName}-{Context}.mp4`
2. **Normalize** to constant frame rate (CFR) and consistent sample rate:
   ```bash
   ffmpeg -y -i input.mp4 -vsync cfr -r 30 -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k -ar 48000 output-cfr.mp4
   ```
   CRITICAL: Keep the ORIGINAL sample rate (usually 48000Hz). Converting to 44100Hz can cause audio distortion.
3. **Transcribe** using Whisper with language specification:
   ```bash
   python3 -m whisper video.mp4 --model small --language pt --output_dir ./ --output_format all
   ```
4. **Probe** duration and metadata:
   ```bash
   ffprobe -v quiet -print_format json -show_format -show_streams video.mp4
   ```
5. **Review transcription** — Whisper makes errors on proper nouns, brand names, technical terms. Always verify and correct.

## 2. Thematic/Intercalated Editing

For multi-speaker videos (tributes, compilations):

### Structure in narrative acts
Instead of playing each person sequentially (boring), split each person's content across thematic acts:

- **Act 1 — Arrival/Introduction**: How they met, first impressions, greetings
- **Act 2 — Character/Personality**: Who the person IS, anecdotes, personality traits
- **Act 3 — Impact/Legacy**: Professional contributions, what they built, what changed
- **Act 4 — Farewell/Wishes**: Gratitude, wishes for success, emotional closings

### Mapping content to acts
For each person:
1. Read their full transcription
2. Identify sentence boundaries (periods, complete thoughts)
3. Map each sentence/block to the appropriate act
4. Record: `(filename, start_sec, end_sec, act, show_lower_third)`

### Lower-thirds
- Show name + role only on **first appearance** of each person
- Render via image (PIL/Canvas) for pixel-perfect control, not native text overlays
- Include subtle accent line (brand color) for visual identity
- Fade in after 0.3s, display for ~4s, fade out

## 3. The Triad Analysis (CRITICAL)

Every cut point MUST be validated against THREE simultaneous timelines:

### Timeline 1: Waveform (Audio)
Extract audio and compute RMS energy at high resolution (25-50ms windows):
```python
def rms_at(data, sr, t, window=0.08):
    s = int(t * sr)
    w = int(window * sr)
    if s - w < 0 or s + w >= len(data):
        return 0
    return int(np.sqrt(np.mean(data[s-w:s+w]**2)))
```

### Timeline 2: Transcription (SRT)
Map each subtitle to its time range. Identify:
- **Sentence boundaries**: where a complete thought ends (period, question mark)
- **Mid-sentence points**: NEVER cut here, even if waveform shows silence

### Timeline 3: Video Timeline (Rendered output)
After rendering, extract audio from the RENDERED video and verify that:
- Cut points match expected positions
- No audio shift was introduced by the rendering pipeline
- Fade zones fall where expected

### Triad Validation Rule
A cut point is VALID only when ALL THREE agree:
1. Waveform: RMS < 300 at cut point
2. Transcription: Cut falls at a sentence boundary (after period/complete thought)
3. Timeline: Fade zones (cut ± fade_duration) are in silence

## 4. Bilateral Fade Validation

A fade has TWO zones that BOTH need silence:

```
[────── FADE OUT ──────][CUT][────── FADE IN ──────]
   cut - fade_dur → cut        cut → cut + fade_dur
```

For a cut at time T with fade duration F:
- **Fade OUT zone**: T-F to T (previous segment's audio fading down)
- **Fade IN zone**: T to T+F (next segment's audio fading up)

### Validation function:
```python
def validate_cut(data, sr, t, fade=0.4):
    rms_cut = rms_at(data, sr, t)
    max_fadeout = max(rms_at(data, sr, t - fade + i*0.05) for i in range(int(fade/0.05)+1))
    max_fadein = max(rms_at(data, sr, t + i*0.05) for i in range(int(fade/0.05)+1))
    return {
        'cut_ok': rms_cut < 300,
        'fadeout_ok': max_fadeout < 1500,
        'fadein_ok': max_fadein < 1500,
    }
```

### Safety margin rule:
`fade_start >= last_voice_moment + 100ms`

This compensates for:
- SRT timestamp imprecision (~50-100ms)
- Audio shift from rendering pipelines
- Reverb/resonance tail of voice

## 5. Finding Optimal Cut Points

Algorithm:
1. Start with transcription: find all sentence boundaries
2. For each sentence boundary, find the nearest silence in waveform (search ±1s)
3. Score each candidate: `score = max_fadeout_rms * 2 + max_fadein_rms * 2 + cut_rms`
4. Bonus (0.5x score) for cuts near subtitle boundaries
5. Pick the lowest score candidate

### When no good cut exists:
If a person speaks without pauses (common in testimonials):
- Reduce fade duration (0.4s → 0.3s → 0.2s)
- Accept that fade will catch some voice — prefer catching the END of a word over the BEGINNING
- Use asymmetric fades: longer fade OUT (0.4s) + shorter fade IN (0.2s)

## 6. Audio Shift Detection

Rendering pipelines (MoviePy, FFmpeg) can introduce audio shift:

### Detection method:
1. Analyze waveform of SOURCE video at known cut points
2. Render the video
3. Analyze waveform of RENDERED video at the same timeline positions
4. Compare: if rendered shows voice where source shows silence, there's a shift

### Typical shifts:
- MoviePy: 50-150ms audio delay
- FFmpeg direct: usually 0ms
- Remotion: usually 0ms (renders via Chrome)

### Compensation:
Adjust all cut points by the detected shift amount.

## 7. Coverage Analysis

Track how much of each person's content is used:

```
coverage = sum(segment_durations) / total_video_duration * 100
```

Rules:
- Aim for >90% coverage for each person
- If <80%, identify what was cut and evaluate if it's important
- Gaps between segments of the same person are OK if they're thematically redundant
- The LAST person to speak should ideally have 100% coverage (strong closing)

## 8. Fade Duration Guidelines

| Context | Recommended fade | Why |
|---------|-----------------|-----|
| Between different people | 0.4s | Natural "scene change" feel |
| Between segments of same person | 0.3s | Lighter, less disruptive |
| First segment (intro → first person) | 0.5s | Smooth entry |
| Last segment (last person → outro) | 0.5s | Smooth exit |
| Dip-to-black (no overlap) | padding=0 | Eliminates voice overlap entirely |

## 9. Common Pitfalls

1. **Trusting SRT timestamps blindly**: Whisper timestamps can be off by 200-500ms. Always cross-reference with waveform.
2. **Cutting at waveform silence without checking context**: A silence between "que você" and "deixou" is NOT a good cut — it's mid-sentence.
3. **Symmetric fade assumption**: Fade OUT problems (cutting voice) are worse perceptually than Fade IN problems (voice entering at reduced volume).
4. **Variable frame rate**: Always convert to CFR before editing. VFR causes audio desync.
5. **Sample rate mismatch**: Keep all files at the same sample rate. Mixed rates cause drift over long videos.
6. **Testing on source, not on render**: Always validate the RENDERED output. The rendering pipeline can introduce shifts.

## 10. Quality Checklist (Pre-delivery)

- [ ] Every transition validated with triad analysis
- [ ] No sentence cut mid-thought
- [ ] Lower-thirds appear only on first appearance
- [ ] Lower-third text not clipped/cut off
- [ ] Audio sync verified on rendered output
- [ ] Coverage >90% for each person
- [ ] Intro and outro present with correct text
- [ ] Background music (if any) doesn't overpower voices
- [ ] Total duration within expected range
