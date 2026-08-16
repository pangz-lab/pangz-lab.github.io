#!/bin/bash

# Creates images.json from all image files in the current directory

OUTPUT="images.json"

# Find common image files and sort them
images=$(find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" -o -iname "*.gif" \) | sed 's|^\./||' | sort)

if [ -z "$images" ]; then
  echo "[]" > "$OUTPUT"
  echo "No images found. Created empty $OUTPUT"
  exit 0
fi

# Build JSON array
echo "[" > "$OUTPUT"

count=0
total=$(echo "$images" | wc -l)

while IFS= read -r img; do
  count=$((count + 1))
  if [ $count -eq $total ]; then
    echo "  \"$img\"" >> "$OUTPUT"
  else
    echo "  \"$img\"," >> "$OUTPUT"
  fi
done <<< "$images"

echo "]" >> "$OUTPUT"

echo "Created $OUTPUT with $total image(s)"