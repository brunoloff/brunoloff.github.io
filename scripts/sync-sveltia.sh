#!/usr/bin/env bash
# Build Sveltia CMS from the brunoloff/sveltia-cms fork and bundle it, with the HTML editor field
# type from ../sveltia-html-editor, into assets/vendor/sveltia.
#
# Usage: scripts/sync-sveltia.sh [path-to-fork-checkout]
#   Default fork path: ../sveltia-cms (next to this repository). The fork's checked-out branch
#   is what gets built, normally `brunoloff` (upstream release + your features).
#
# Needs Node and pnpm (the fork pins its pnpm version in package.json).
set -euo pipefail

site="$(cd "$(dirname "$0")/.." && pwd)"
fork="$(cd "${1:-$site/../sveltia-cms}" && pwd)"

if [[ "$fork" != "$(cd "$site/../sveltia-cms" && pwd)" ]]; then
  # cms/package.json points at ../../sveltia-cms/package; keep the fork in that place.
  echo "The fork must be checked out at $site/../sveltia-cms (cms/package.json expects it there)." >&2
  exit 1
fi

pnpm_cmd=(pnpm)
command -v pnpm >/dev/null 2>&1 || pnpm_cmd=(corepack pnpm)

if [[ -n "$(git -C "$fork" status --porcelain --untracked-files=no)" ]]; then
  echo "Warning: the fork has uncommitted changes; the recorded commit won't match the build." >&2
fi

echo "==> Building the fork ($(git -C "$fork" rev-parse --abbrev-ref HEAD) @ $(git -C "$fork" rev-parse --short HEAD))"
(cd "$fork" && "${pnpm_cmd[@]}" install --frozen-lockfile && "${pnpm_cmd[@]}" build)

echo "==> Bundling it for the website"
(cd "$site/cms" && rm -rf node_modules/@sveltia/cms node_modules/sveltia-html-editor && npm install --install-links --no-audit --no-fund @sveltia/cms@file:../../sveltia-cms/package sveltia-html-editor@file:../../sveltia-html-editor && npm run build)

echo "==> Stamping the bundle version into admin/index.html"
# The entry file keeps its name between builds; a version query makes browsers fetch the new one
# instead of a cached copy that points at chunks which no longer exist.
stamp="$(sha256sum "$site/assets/vendor/sveltia/sveltia-cms.js" | cut -c1-10)"
sed -i -E "s#/assets/vendor/sveltia/sveltia-cms\.js(\?v=[0-9a-f]+)?'#/assets/vendor/sveltia/sveltia-cms.js?v=$stamp'#" "$site/admin/index.html"

echo "==> Copying the license, schema and version record"
cp "$fork/LICENSE.txt" "$site/assets/vendor/sveltia/LICENSE.txt"
cp "$fork/package/schema/sveltia-cms.json" "$site/admin/sveltia-cms.schema.json"
cat > "$site/assets/vendor/sveltia/VERSION.txt" <<EOF
Sveltia CMS $(node -p "require('$fork/package/package.json').version")
Fork: https://github.com/brunoloff/sveltia-cms
Branch: $(git -C "$fork" rev-parse --abbrev-ref HEAD)
Commit: $(git -C "$fork" rev-parse HEAD)
Upstream base: $(git -C "$fork" describe --tags --abbrev=0 2>/dev/null || echo unknown)
HTML editor: $(git -C "$site/../sveltia-html-editor" rev-parse HEAD 2>/dev/null || echo uncommitted)
EOF

echo "==> Done: $(du -sh "$site/assets/vendor/sveltia" | cut -f1) in assets/vendor/sveltia"
cat "$site/assets/vendor/sveltia/VERSION.txt"
