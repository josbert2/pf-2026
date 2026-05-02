#!/usr/bin/env bash

URL="https://www.prototypestudio.fr"
OUTPUT="site_clone"

echo "Clonando sitio..."

wget \
--recursive \
--level=3 \
--page-requisites \
--html-extension \
--convert-links \
--restrict-file-names=windows \
--domains prototypestudio.fr \
--no-parent \
--user-agent="Mozilla/5.0" \
--directory-prefix="$OUTPUT" \
"$URL"

echo "✅ Clonación lista en carpeta: $OUTPUT"