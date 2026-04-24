#!/usr/bin/env bash
# Start a local Navidrome instance then launch Expo.
#
# Navidrome URL:         http://127.0.0.1:4534
# Navidrome credentials: admin / admin
#
# Both processes share the terminal. Ctrl-C stops both and removes temp dirs.

set -euo pipefail

DEV_PORT=4534

# ---------------------------------------------------------------------------
# Resolve binaries — prefer PATH, fall back to nix build.
# ---------------------------------------------------------------------------
resolve_bin() {
	local name="$1" nix_attr="$2"
	if command -v "$name" &>/dev/null; then
		command -v "$name"
	else
		nix build "$nix_attr" --no-link --print-out-paths 2>/dev/null |
			tr -d '[:space:]' | sed "s|$|/bin/$name|"
	fi
}

NAVIDROME_BIN=$(resolve_bin navidrome nixpkgs#navidrome)
FFMPEG_BIN=$(resolve_bin ffmpeg nixpkgs#ffmpeg)

# ---------------------------------------------------------------------------
# Temp dirs
# ---------------------------------------------------------------------------
DATA_DIR=$(mktemp -d /tmp/navidrome-dev-data-XXXXXX)
MUSIC_DIR=$(mktemp -d /tmp/navidrome-dev-music-XXXXXX)

cleanup() {
	echo "[dev] shutting down..."
	kill "$NAVIDROME_PID" 2>/dev/null || true
	rm -rf "$DATA_DIR" "$MUSIC_DIR"
}
trap cleanup EXIT INT TERM

# ---------------------------------------------------------------------------
# Generate a silent test track so the library is not empty.
# ---------------------------------------------------------------------------
"$FFMPEG_BIN" \
	-f lavfi -i anullsrc=r=44100:cl=stereo \
	-t 1 -q:a 9 -acodec libmp3lame \
	-metadata title=Silence \
	-metadata artist="Test Artist" \
	-metadata album="Test Album" \
	-metadata track=1 \
	"$MUSIC_DIR/silence.mp3" \
	-loglevel quiet

# ---------------------------------------------------------------------------
# Start Navidrome.
# ---------------------------------------------------------------------------
echo "[navidrome] starting on http://0.0.0.0:$DEV_PORT ..."
"$NAVIDROME_BIN" \
	--datafolder "$DATA_DIR" \
	--musicfolder "$MUSIC_DIR" \
	--port "$DEV_PORT" \
	--address 0.0.0.0 \
	--loglevel error \
	--nobanner &
NAVIDROME_PID=$!

# Wait for the HTTP server to be ready (up to 20 s).
for i in $(seq 1 67); do
	if curl -sf "http://127.0.0.1:$DEV_PORT/app" -o /dev/null; then
		break
	fi
	[ "$i" -eq 67 ] && {
		echo "[navidrome] timed out waiting for server"
		exit 1
	}
	sleep 0.3
done

# ---------------------------------------------------------------------------
# Create the admin user (first-run endpoint).
# ---------------------------------------------------------------------------
HTTP_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" \
	-X POST "http://127.0.0.1:$DEV_PORT/auth/createAdmin" \
	-H "Content-Type: application/json" \
	-d '{"username":"admin","password":"admin"}')

if [ "$HTTP_STATUS" != "200" ]; then
	echo "[navidrome] failed to create admin user (HTTP $HTTP_STATUS)"
	exit 1
fi
echo "[navidrome] admin user created (admin / admin)"

# ---------------------------------------------------------------------------
# Start Expo.
# ---------------------------------------------------------------------------
echo "[expo] starting..."
npx expo start
