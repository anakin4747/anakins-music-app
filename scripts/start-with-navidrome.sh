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
# Helper: generate a 1-second silent MP3 with ID3 tags.
# ---------------------------------------------------------------------------
make_track() {
	local file="$1" title="$2" artist="$3" album="$4" track="$5"
	"$FFMPEG_BIN" \
		-f lavfi -i anullsrc=r=44100:cl=stereo \
		-t 1 -q:a 9 -acodec libmp3lame \
		-metadata title="$title" \
		-metadata artist="$artist" \
		-metadata album="$album" \
		-metadata track="$track" \
		"$file" \
		-loglevel quiet
}

# ---------------------------------------------------------------------------
# Generate 30 fake albums (one track each).
# ---------------------------------------------------------------------------
echo "[dev] generating fake music library..."

make_track "$MUSIC_DIR/01-vader-01.mp3" "Shadows of the Empire" "Darth Vader" "The Dark Side Sessions" 1
make_track "$MUSIC_DIR/02-obiwan-01.mp3" "High Ground" "Obi-Wan Kenobi" "A New Hope Acoustic" 1
make_track "$MUSIC_DIR/03-yoda-01.mp3" "Do or Do Not" "Yoda" "Meditations from Dagobah" 1
make_track "$MUSIC_DIR/04-solo-01.mp3" "Parsecs" "Han Solo" "Kessel Run Classics" 1
make_track "$MUSIC_DIR/05-leia-01.mp3" "Help Me" "Princess Leia" "Alderaan Ballads" 1
make_track "$MUSIC_DIR/06-luke-01.mp3" "Binary Sunset" "Luke Skywalker" "Desert Sunrise" 1
make_track "$MUSIC_DIR/07-fett-01.mp3" "No Disintegrations" "Boba Fett" "Bounty Hunter Blues" 1
make_track "$MUSIC_DIR/08-r2d2-01.mp3" "Beep Boop Bop" "R2-D2" "Binary Beeps Vol. 1" 1
make_track "$MUSIC_DIR/09-3po-01.mp3" "Odds of Survival" "C-3PO" "Protocol Droid Polkas" 1
make_track "$MUSIC_DIR/10-chewie-01.mp3" "Wookiee Roar" "Chewbacca" "Wookiee Roar Sessions" 1
make_track "$MUSIC_DIR/11-jabba-01.mp3" "Hutt Boogie" "Jabba the Hutt" "Tatooine Lounge" 1
make_track "$MUSIC_DIR/12-lando-01.mp3" "Smooth Operator" "Lando Calrissian" "Cloud City Jazz" 1
make_track "$MUSIC_DIR/13-padme-01.mp3" "Lake Retreat" "Padme Amidala" "Naboo Symphonies" 1
make_track "$MUSIC_DIR/14-quigon-01.mp3" "Living Force" "Qui-Gon Jinn" "Living Force" 1
make_track "$MUSIC_DIR/15-mace-01.mp3" "Purple Saber Funk" "Mace Windu" "Purple Saber Funk" 1
make_track "$MUSIC_DIR/16-dooku-01.mp3" "Elegies of Serenno" "Count Dooku" "Sith Elegies" 1
make_track "$MUSIC_DIR/17-maul-01.mp3" "Duel of the Fates (Cover)" "Darth Maul" "Double Blade" 1
make_track "$MUSIC_DIR/18-grievous-01.mp3" "March of the Cyborg" "General Grievous" "March of the Cyborg" 1
make_track "$MUSIC_DIR/19-rey-01.mp3" "Scavenger" "Rey" "Jakku Junkyard Jams" 1
make_track "$MUSIC_DIR/20-finn-01.mp3" "Defector" "Finn" "First Order Dropout" 1
make_track "$MUSIC_DIR/21-poe-01.mp3" "Black Leader" "Poe Dameron" "Pilots Playlist" 1
make_track "$MUSIC_DIR/22-kylo-01.mp3" "Tantrum" "Kylo Ren" "Tantrum" 1
make_track "$MUSIC_DIR/23-bb8-01.mp3" "Rolling in the Deep Space" "BB-8" "Rolling in the Deep Space" 1
make_track "$MUSIC_DIR/24-grogu-01.mp3" "This Is the Way (Lullaby)" "Grogu" "The Childs Lullabies" 1
make_track "$MUSIC_DIR/25-mando-01.mp3" "The Way" "Din Djarin" "The Way Original Score" 1
make_track "$MUSIC_DIR/26-ahsoka-01.mp3" "Twilight of the Apprentice" "Ahsoka Tano" "Twilight of the Apprentice" 1
make_track "$MUSIC_DIR/27-bokatan-01.mp3" "Mandalore Rising" "Bo-Katan Kryze" "Mandalore Rising" 1
make_track "$MUSIC_DIR/28-thrawn-01.mp3" "Heir to the Empire" "Grand Admiral Thrawn" "Heir to the Empire OST" 1
make_track "$MUSIC_DIR/29-ezra-01.mp3" "Ghost Crew" "Ezra Bridger" "Ghost Crew Chronicles" 1
make_track "$MUSIC_DIR/30-hera-01.mp3" "Lothal Sessions" "Hera Syndulla" "Lothal Sessions" 1

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
# Wait for the library scan to finish (up to 30 s).
# ---------------------------------------------------------------------------
SONGS_URL="http://127.0.0.1:$DEV_PORT/rest/getSongs.view?u=admin&p=admin&c=dev&f=json&v=1.16.1"
echo "[navidrome] waiting for library scan..."
for i in $(seq 1 60); do
	COUNT=$(curl -sf "$SONGS_URL" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('subsonic-response',{}).get('song',[])))" 2>/dev/null || echo 0)
	if [ "${COUNT:-0}" -gt 0 ]; then
		echo "[navidrome] library scan complete ($COUNT tracks indexed)"
		break
	fi
	[ "$i" -eq 60 ] && echo "[navidrome] warning: scan timed out, playlists may be empty"
	sleep 0.5
done

# ---------------------------------------------------------------------------
# Create 30 fake playlists via the Subsonic API.
# ---------------------------------------------------------------------------
echo "[navidrome] creating fake playlists..."

create_playlist() {
	local name="$1"
	curl -sf -o /dev/null \
		"http://127.0.0.1:$DEV_PORT/rest/createPlaylist.view?u=admin&p=admin&c=dev&f=json&v=1.16.1&name=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$name")"
}

create_playlist "Hyperdrive Hits"
create_playlist "Force Sensitive Frequencies"
create_playlist "Mos Eisley Cantina Mix"
create_playlist "Imperial March Remixes"
create_playlist "Rebel Alliance Anthems"
create_playlist "Sith Lord Selections"
create_playlist "Jedi Temple Acoustics"
create_playlist "Galaxy Far Far Away"
create_playlist "Podracer Warm-Up"
create_playlist "Clone Wars Classics"
create_playlist "Mandalorian Moods"
create_playlist "Outer Rim Originals"
create_playlist "Galactic Senate Sessions"
create_playlist "Death Star Disco"
create_playlist "Endor Forest Vibes"
create_playlist "Hoth Chill Out"
create_playlist "Dagobah Deep Focus"
create_playlist "Coruscant Nightlife"
create_playlist "Tatooine Sunsets"
create_playlist "Naboo Nostalgia"
create_playlist "Ahch-To Ambient"
create_playlist "Bespin Smooth Jazz"
create_playlist "Starkiller Bass"
create_playlist "Rogue One Rarities"
create_playlist "Battle of Yavin Bangers"
create_playlist "Skywalker Saga Soundtrack"
create_playlist "Droid Disco"
create_playlist "Space Cantina Covers"
create_playlist "Bounty Hunter Beats"
create_playlist "New Republic Radio"

echo "[navidrome] 30 playlists created"

# ---------------------------------------------------------------------------
# Start Expo.
# ---------------------------------------------------------------------------
echo "[expo] starting..."
npx expo start
