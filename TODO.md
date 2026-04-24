
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
