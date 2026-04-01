# Video Intake Pipeline

Use this section when receiving new raw video files (Types B & C).

## Steps

### 1. Copy and rename
Standardize file naming: `{PersonName}-{Context}.mp4`

### 2. Normalize to CFR (Constant Frame Rate)

Variable frame rate (VFR) causes audio desync in Remotion. Always convert:

```bash
bunx remotion ffmpeg -y -i input.mp4 -vsync cfr -r 30 -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k -ar 48000 output-cfr.mp4
```

> **CRITICAL:** Keep the original sample rate (usually 48000Hz). Do NOT convert to 44100Hz — it causes audio distortion.

### 3. Probe duration and metadata

```bash
bunx remotion ffprobe -v quiet -print_format json -show_format -show_streams input.mp4
```

### 4. Transcribe with Whisper

```bash
python3 -m whisper video.mp4 --model small --language pt --output_dir ./ --output_format all
```

This generates `.srt`, `.txt`, `.vtt`, `.tsv`, `.json` — keep all formats.

> **Alternative (in-ecosystem):** Use `@remotion/install-whisper-cpp` for transcription that produces Remotion-native `Caption` objects directly, avoiding manual SRT parsing. Load `remotion-best-practices/rules/transcribe-captions.md` for details.

### 5. Review transcription

Whisper makes errors on proper nouns, brand names, and technical terms. Always verify and correct the `.srt` before using it for cut analysis.

## Placing assets

After intake, move CFR files to `public/` or use `setup.sh` to create symlinks:

```bash
ln -sf ../../PersonName-cfr.mp4 public/PersonName-cfr.mp4
```

For Remotion to use assets at runtime, they must be accessible via `staticFile()`.
