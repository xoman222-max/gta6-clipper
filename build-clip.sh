#!/bin/bash
# Build clip.mp4 (1080x1920, ~30s) from the official GTA VI Launch Trailer.
# Moment: t44-56 of the trailer - club, police chase, dirt-bike rooftop jump
# (slowed to 0.5x), landing, Jason on the rooftop at night with the
# helicopter over the Vice City skyline as an explosion erupts.
# Pitch: frozen rooftop-explosion frame with slow zoom + on-screen text + voiceover.
set -e
cd ~/workspace/make-fun/gta6-clipper-01
SRC=source-launch-trailer-ps.webm
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf

# Freeze frame for the pitch section (t=52.5s: Jason, helicopter, skyline).
# NOTE: -ss must come AFTER -i (accurate seek). Fast seek (-ss before -i)
# lands on the keyframe before 52s, which is the murky t51 transition frame.
ffmpeg -y -v error -i "$SRC" -ss 52.5 -frames:v 1 still52.png

# Voiceover is voiceover.wav (flite, local). Bed = trailer audio, quiet.
ffmpeg -y -v error -i "$SRC" -i still52.png -i voiceover.wav -filter_complex_script build-filter.txt \
  -map "[vout]" -map "[aout]" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 128k -movflags +faststart clip.mp4

ffprobe -v error -show_entries stream=width,height,codec_name,r_frame_rate -show_entries format=duration,size -of default=noprint_wrappers=1 clip.mp4
cp clip.mp4 clip-backup.mp4
echo BUILD-DONE
