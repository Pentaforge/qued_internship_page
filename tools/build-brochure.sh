#!/usr/bin/env bash
# Regenerate assets/QUED-Metrics-Internship-Brochure.pdf from tools/brochure.html
#
#   bash tools/build-brochure.sh
#
# Needs gstack browse (for headless Chrome's PDF export) and python3.
# A local server is required: the page pulls Google Fonts and uses relative
# asset paths, neither of which resolve over file://.
set -e
cd "$(dirname "$0")/.."
B="${B:-$HOME/.claude/skills/gstack/browse/dist/browse}"
OUT="assets/QUED-Metrics-Internship-Brochure.pdf"
PORT=8999

python -m http.server "$PORT" >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
sleep 2

"$B" viewport 900x1300 >/dev/null
"$B" goto "http://localhost:$PORT/tools/brochure.html" >/dev/null
"$B" wait --networkidle >/dev/null
"$B" pdf "$(pwd)/$OUT" --prefer-css-page-size --print-background

echo "wrote $OUT"
echo "NOTE: if the file size changed, update the 'MB' labels in index.html."
