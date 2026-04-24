
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

figure out a way to preview pull requests in Expo Go on the phone directly
from GitHub — ideally so that each PR triggers a shareable Expo preview URL
that can be opened on device without having to run the dev server locally.

options to investigate:
  - Expo Application Services (EAS) Update + a GitHub Actions workflow that
    publishes an EAS update channel per PR and posts the URL as a PR comment
  - Expo's built-in GitHub integration (if the repo is linked to an EAS project)
  - a self-hosted tunnel (e.g. ngrok or Cloudflare Tunnel) started by CI that
    exposes the Metro bundler and posts the QR code as a PR comment

goal: scan a QR code from a PR comment and immediately test the branch in
Expo Go with no local setup required.
