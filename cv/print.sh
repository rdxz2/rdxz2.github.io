#!/bin/sh
# Print the CV HTML to the published PDF and fail if it isn't exactly one page.
# Chrome's stderr is hidden: on macOS it logs a harmless TASK_SUPPRESSION_POLICY error.
set -e
cd "$(dirname "$0")/.."
PDF=public/richard-dharmawan-cv.pdf
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --no-pdf-header-footer \
  --print-to-pdf="$PDF" cv/richard-dharmawan-cv.html 2>/dev/null
PAGES=$(grep -a -o '/Count [0-9]*' "$PDF" | head -1 | cut -d' ' -f2)
if [ "$PAGES" != 1 ]; then
  echo "CV is $PAGES pages, must be 1. Trim wording in cv/richard-dharmawan-cv.html." >&2
  exit 1
fi
echo "Printed $PDF (1 page)"
