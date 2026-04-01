---
name: video-editing-workflow
description: Workflow for video production in Remotion (React) — from motion graphics to multi-speaker testimonials. Covers video intake, FFmpeg CFR normalization, Whisper transcription, precision cutting with triad validation (waveform × transcription × timeline), bilateral fade validation, audio shift detection, and quality assurance. Use this skill whenever editing real video footage, building testimonial compilations, tribute videos, interview montages, or any Remotion project that imports external video/audio files.
metadata:
  tags: video, editing, workflow, remotion, waveform, transcription, testimonial, motion-graphics, ffmpeg, whisper, srt, multi-speaker, audio-sync, fade, cut-validation, lower-third, captions
dependencies:
  - remotion-best-practices  # install: npx skills add remotion-dev/skills
---

# Video Editing Workflow

## Relationship to remotion-best-practices

This skill covers **editorial decisions** — what to cut, where to cut, how to validate cuts.
For **Remotion implementation** (how to code transitions, trim videos, animate components), load the `remotion-best-practices` skill.

Key convention: inside a Remotion project, always use `bunx remotion ffmpeg` and `bunx remotion ffprobe` — no system FFmpeg needed.

## 0. Identify Your Video Type

### Type A — Motion Graphics / Animation (no imported footage)
Examples: promotional videos, explainers, animated presentations.
- Skip sections 1, 3–7 (no real footage to analyze)
- Use `remotion-best-practices` for components, animations, transitions
- Focus on: scene structure, timing, visual design

### Type B — Real Footage Editing (imported video/audio)
Examples: testimonial compilations, tribute videos, interview montages.
- Follow the FULL pipeline (load all rule files as needed)
- Triad analysis (`rules/triad-analysis.md`) is mandatory for every cut point

### Type C — Mixed (footage + motion graphics)
- Follow full pipeline for footage segments
- Use `remotion-best-practices` for animated segments
- Pay extra attention to transitions between footage and graphics

### Universal rules (all types)
1. Always use Remotion Studio (`npm start`) for real-time preview — never render blindly
2. Structure videos in scenes/acts before writing any code
3. Prepare all assets in `public/` before starting
4. Iterate scene by scene, not the whole video at once

## Rule Files

Load individual rule files on demand — only what the current task requires:

| File | When to load |
|------|-------------|
| [`rules/video-intake.md`](rules/video-intake.md) | Receiving new raw footage — CFR normalization, probing, transcription |
| [`rules/thematic-editing.md`](rules/thematic-editing.md) | Multi-speaker videos — act structure, segment mapping, lower-thirds |
| [`rules/triad-analysis.md`](rules/triad-analysis.md) | Finding and validating cut points — waveform × SRT × rendered output |
| [`rules/audio-shift.md`](rules/audio-shift.md) | Rendered audio doesn't match source — shift detection and compensation |
| [`rules/coverage-analysis.md`](rules/coverage-analysis.md) | Checking how much of each person's content is used |
| [`rules/fade-guidelines.md`](rules/fade-guidelines.md) | Choosing fade durations — with Remotion TransitionSeries examples |
| [`rules/pitfalls.md`](rules/pitfalls.md) | Something feels off — common mistakes and how to avoid them |
| [`rules/quality-checklist.md`](rules/quality-checklist.md) | Pre-delivery review — full checklist before final render |
