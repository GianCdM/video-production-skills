#!/bin/bash
# Setup script for Valeu, Paga! — Remotion video project
# Run this once after cloning: bash setup.sh

set -e

cd "$(dirname "$0")"

echo "==> Installing npm dependencies..."
npm install

echo "==> Linking video files to public/..."

# Video files expected in the project root or a parent directory.
# Adjust VIDEO_DIR if your .mp4 files are stored elsewhere.
VIDEO_DIR="./"

FILES=(
  "Gian-Paga-cfr.mp4"
  "Marcelo-Paga-cfr.mp4"
  "Lucas Pessoa-Paga-cfr.mp4"
  "Eli-Paga-cfr.mp4"
  "Aline_Paga-cfr.mp4"
  "Debora-Paga-cfr.mp4"
  "Marta-Paga-cfr.mp4"
  "giu-paga-cfr.mp4"
  "Edu-Paga-cfr.mp4"
  "Natalia-Paga-cfr.mp4"
  "Renan-Paga-cfr.mp4"
)

for f in "${FILES[@]}"; do
  if [ -f "${VIDEO_DIR}${f}" ]; then
    ln -sf "../${f}" "public/${f}"
    echo "   Linked: ${f}"
  else
    echo "   WARNING: ${VIDEO_DIR}${f} not found — place it in the project root"
  fi
done

# Music file
if [ -f "Voa-Paga.mp3" ]; then
  ln -sf "../Voa-Paga.mp3" "public/Voa-Paga.mp3"
  echo "   Linked: Voa-Paga.mp3"
elif [ ! -f "public/Voa-Paga.mp3" ]; then
  echo "   NOTE: Place Voa-Paga.mp3 in the project root or public/"
fi

echo ""
echo "==> Setup complete!"
echo "    npm start   — Open Remotion Studio (preview)"
echo "    npm run build — Render final video"
