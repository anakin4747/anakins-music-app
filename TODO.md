
If a user swipes to the first server doesn't fill it out then swipes to the
second server and fills that one out, upon returning to the main menu the
empty "first server" should be replaced by the contents of the "second server".

This should apply for any empty server forms that have a populated server of a
higher number. I don't want any empty forms filling up space. So everytime you
return to the main menu your servers' settings should be shifted into the
lowest ordinal numbers as possible to remove any empty server forms

---

if the log under "ping" grows off screen the user should be able to scroll down
to see the bottom of the logs but the UI won't tail the logs.

upon scrolling the whole form should scroll with it all smoothly including the
"first server" text

if text does not extend of screen nothing should scroll

---

swipping right to left on "queues" or "servers" in the main menu for queues and
servers should also navigate to those screens

---

All the other server screens should save their own server configurations and
not reuse the ones from the other server screens

---

plan nested playlist support — a playlist type that can contain other playlists,
whole albums, and individual songs, without flattening albums or child playlists
into their constituent tracks.

the subsonic API has no concept of nested playlists or album-as-playlist-item.
investigate whether this requires forking navidrome (or contributing upstream)
to extend the API, or whether it can be modelled client-side by convention
(e.g. a playlist whose name starts with "@album:" is treated as an album
reference). document the options and tradeoffs before writing any code.

---

swiping right-to-left on an album or playlist row should open that item,
matching the behaviour already in place via the SwipeOpenView component.
currently the swipe gesture navigates to the detail screen but the row does
not give any visual affordance that a swipe occurred. investigate whether the
issue is in the gesture threshold, the navigation call, or the absence of
visual feedback, and fix accordingly.
