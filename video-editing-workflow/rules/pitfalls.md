# Common Pitfalls

Hard-learned lessons from real video editing sessions.

## 1. Trusting SRT Timestamps Blindly

Whisper timestamps can be off by **200–500ms**. A subtitle showing start=10.0s may actually start at 10.3s in the audio. Always cross-reference with waveform before placing a cut.

## 2. Cutting at Waveform Silence Without Checking Context

A silence between "que você" and "deixou" is NOT a good cut — it's mid-sentence. Silence in the waveform only means the person paused briefly; the transcription tells you whether the thought is complete.

## 3. Symmetric Fade Assumption

Fade OUT problems (cutting voice short) are perceptually worse than Fade IN problems (voice entering at slightly reduced volume). When forced to choose, let the fade IN catch a little voice rather than the fade OUT.

## 4. Variable Frame Rate (VFR)

Always convert source footage to CFR before editing. VFR causes audio desync that accumulates over time — a 30-minute video can drift by several seconds.

```bash
bunx remotion ffmpeg -y -i input.mp4 -vsync cfr -r 30 -c:v libx264 -preset fast -crf 18 -c:a aac -ar 48000 output-cfr.mp4
```

## 5. Sample Rate Mismatch

Keep all source files at the same sample rate. Mixed rates (e.g., 44100Hz + 48000Hz) cause audio drift over long videos. Always probe before normalizing:

```bash
bunx remotion ffprobe -v quiet -print_format json -show_streams input.mp4 | grep sample_rate
```

## 6. Testing on Source, Not on Render

Always validate the RENDERED output. The rendering pipeline can introduce audio shifts (see `audio-shift.md`). A cut that looks clean in source may clip voice in the rendered file.

## 7. Ignoring Lower-Third Timing

Lower-thirds that appear during action (someone laughing, moving) look jarring. Show them during a relatively still, well-lit moment — typically the first 4s of someone's first segment.
