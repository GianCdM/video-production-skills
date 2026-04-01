# Quality Checklist (Pre-delivery)

Run through this before rendering the final video.

## Cuts & Audio
- [ ] Every transition validated with triad analysis (waveform + SRT + rendered output)
- [ ] No sentence cut mid-thought
- [ ] Audio sync verified on rendered output (compare RMS at cut points)
- [ ] No sample rate mismatch across source files
- [ ] All source files converted to CFR

## Visual
- [ ] Lower-thirds appear only on first appearance of each person
- [ ] Lower-third text not clipped or cut off (check with `measuring-text` if using Remotion-native)
- [ ] Intro and outro present with correct text
- [ ] Act title cards (if used) appear between the right segments

## Content
- [ ] Coverage >90% for each person
- [ ] Last speaker has strong closing (ideally 100% coverage)
- [ ] Background music (if any) doesn't overpower voices

## Captions (if applicable)
- [ ] Captions reviewed and corrected for proper nouns / brand names
- [ ] Caption timing synced to rendered audio (not just source SRT)
- [ ] Load `remotion-best-practices/rules/display-captions.md` for rendering options

## Render
- [ ] Total duration within expected range
- [ ] Rendered at correct resolution and frame rate (e.g., 1280×720 @ 30fps)
- [ ] Output file size is reasonable
