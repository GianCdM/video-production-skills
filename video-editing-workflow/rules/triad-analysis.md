# Triad Analysis — Cut Point Validation

Every cut point MUST be validated against THREE simultaneous timelines. Skipping any one of them leads to bad cuts.

## The Three Timelines

### Timeline 1: Waveform (Audio)

Extract audio and compute RMS energy at high resolution (25–50ms windows):

```python
import numpy as np
import soundfile as sf

data, sr = sf.read("video.wav")  # extract with: bunx remotion ffmpeg -i video.mp4 -ac 1 -ar 16000 video.wav

def rms_at(data, sr, t, window=0.08):
    s = int(t * sr)
    w = int(window * sr)
    if s - w < 0 or s + w >= len(data):
        return 0
    return int(np.sqrt(np.mean(data[s-w:s+w]**2)))
```

> **Tip:** For visual waveform QA during preview, `@remotion/media-utils` provides `useAudioData()` and `visualizeAudio()` to render a real-time waveform in Remotion Studio. Load `remotion-best-practices/rules/audio-visualization.md`.

### Timeline 2: Transcription (SRT)

Map each subtitle to its time range. Identify:
- **Sentence boundaries**: where a complete thought ends (period, question mark)
- **Mid-sentence points**: never cut here, even if waveform shows silence

```python
import re

def parse_srt(path):
    with open(path) as f:
        content = f.read()
    blocks = content.strip().split('\n\n')
    entries = []
    for block in blocks:
        lines = block.strip().split('\n')
        if len(lines) >= 3:
            times = lines[1].split(' --> ')
            start = srt_time_to_sec(times[0])
            end = srt_time_to_sec(times[1])
            text = ' '.join(lines[2:])
            entries.append({'start': start, 'end': end, 'text': text})
    return entries

def srt_time_to_sec(t):
    h, m, s = t.strip().replace(',', '.').split(':')
    return int(h)*3600 + int(m)*60 + float(s)
```

> **Note:** Whisper timestamps can be off by 200–500ms. Always cross-reference with waveform. Never trust SRT timestamps as ground truth.

### Timeline 3: Rendered Output

After rendering, extract audio from the RENDERED video and verify:
- Cut points match expected positions
- No audio shift was introduced by the pipeline
- Fade zones fall where expected

```bash
bunx remotion ffmpeg -i rendered.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 rendered.wav
```

Then run the same RMS analysis on `rendered.wav` at expected cut positions.

## Triad Validation Rule

A cut point is **VALID** only when ALL THREE agree:
1. **Waveform:** RMS < 300 at cut point
2. **Transcription:** Cut falls at a sentence boundary (after period / complete thought)
3. **Timeline:** Fade zones (cut ± fade_duration) are in silence

## Bilateral Fade Validation

A fade has TWO zones that BOTH need silence:

```
[────── FADE OUT ──────][CUT][────── FADE IN ──────]
   cut - fade_dur → cut        cut → cut + fade_dur
```

```python
def validate_cut(data, sr, t, fade=0.4):
    rms_cut = rms_at(data, sr, t)
    max_fadeout = max(rms_at(data, sr, t - fade + i*0.05) for i in range(int(fade/0.05)+1))
    max_fadein  = max(rms_at(data, sr, t + i*0.05)        for i in range(int(fade/0.05)+1))
    return {
        'cut_ok':     rms_cut    < 300,
        'fadeout_ok': max_fadeout < 1500,
        'fadein_ok':  max_fadein  < 1500,
    }
```

**Safety margin rule:** `fade_start >= last_voice_moment + 100ms`

This compensates for SRT timestamp imprecision (~50–100ms), audio shift from rendering pipelines, and reverb/resonance tail of voice.

## Finding Optimal Cut Points

Algorithm:
1. Start with transcription: find all sentence boundaries
2. For each sentence boundary, find the nearest silence in waveform (search ±1s)
3. Score each candidate: `score = max_fadeout_rms * 2 + max_fadein_rms * 2 + cut_rms`
4. Bonus (0.5× score) for cuts near subtitle boundaries
5. Pick the lowest score candidate

### When no good cut exists

If a person speaks without pauses (common in testimonials):
- Reduce fade duration (0.4s → 0.3s → 0.2s)
- Accept that fade will catch some voice — prefer catching the END of a word over the BEGINNING
- Use asymmetric fades: longer fade OUT (0.4s) + shorter fade IN (0.2s)
