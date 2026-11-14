# ElevaTok

Created by **Datamonnit** for Junction 2026.

## Source and browser demo

This repository contains the TypeScript extension source and a ready-to-host browser demo in `web-demo/`. Upload the contents of `web-demo/` to a static host such as Netlify; no build is needed for that version. Its derived preferences use tab-session storage.

For the extension, install Node.js 24+, run `node scripts/build-offline.mjs`, then load the generated `dist/` directory in Edge or Chrome. Run `node --test scripts/focus.test.mjs scripts/search.test.mjs` to verify the core behavior.


A mood-guided search assistant for TikTok. Choose how you feel, choose an experience, optionally add interests, and click Open TikTok. ElevaTok opens related search results on TikTok's own website without showing the search phrase first.

There is no collection or video feed inside ElevaTok. It does not scrape TikTok, filter videos, change recommendations, create Favorites folders, generate videos or perform account actions.

## Install in Edge or Chrome

1. Extract ElevaTok-team.zip into a folder you will keep.
2. Open edge://extensions or chrome://extensions and enable Developer mode.
3. Choose Load unpacked and select the extracted dist folder.
4. Open ElevaTok from the Extensions menu and pin it if desired.

No npm installation is needed for the included build. For an existing installation, reload it in the extensions page and close/reopen older extension tabs. Refresh any TikTok tabs left open from earlier live-filter versions. The old collection page now redirects locally to ElevaTok.

## Use

Pick one of eleven moods and twelve experiences, optionally type a preference such as `show cars, no news`, then click Open TikTok. The browser opens matching search results directly on TikTok. Use Try another direction for another related query; it keeps the note and does not open a tab until you click Open TikTok again.

Your full note and mood label stay in page memory and are not saved. Only a generated phrase made from recognized generic topics is sent in the TikTok search URL after your click. The phrase is not previewed inside ElevaTok; it is naturally visible in TikTok's search box, address bar and browser history. TikTok applies its own data practices. No external requests, hidden search tabs or API calls are made by ElevaTok.

TikTok chooses and ranks the results. Exclusions guide which query topics ElevaTok suggests, but cannot remove videos from TikTok or guarantee that unwanted content will not appear. This is keyword matching, not general language understanding or a validated wellness intervention. Users may manually save videos into TikTok's own collections.

## Privacy and permissions

The extension has no website host access or content scripts. A minimal launcher service worker opens or focuses only its own full-page interface. Its security policy blocks network fetches, media loading and frames inside the extension. The ordinary user-clicked TikTok link is the only external navigation.

The storage permission keeps browser-session-only rotation, derived topic preferences and last-search feedback, recent search-template identifiers, an Undo snapshot and the extension view-tab identifier. It also supports explicitly resetting feedback and removing known legacy keys. No full note, mood label, query URL or actual TikTok browsing history is stored. New check-ins are never read from storage or saved to storage. Closing or reloading the page clears the current check-in. For shared devices, delete old data or remove the old installation before presenting.

See public/privacy.html and LEGAL-STATUS.md. This independent prototype is not affiliated with TikTok or a legal compliance certification.

## Build and check

Node.js 24 is sufficient for the dependency-free build:

    node scripts/build-offline.mjs
    node --test scripts/focus.test.mjs scripts/search.test.mjs

Twenty checks cover topics, mood/experience combinations, related query variation, note preservation, no preview, click-only navigation, explicit legacy deletion and absence of scraping/background/video capabilities.

The optional React development popup uses npm install, npm run dev and npm run build. Registry access is needed for npm installation; the included dependency-free build is verified separately.

## Source

- src/engine.ts: moods, experiences and local keyword preferences.
- src/search.ts: generic related query generation and encoded TikTok links.
- src/search-ui.ts: mood check-in and direct Open TikTok action.
- src/popup.ts: dependency-free entry point.
- src/main.tsx: React development entry point using the same interface.
- public: manifest, styles and privacy notice.

## More specific prompts and varied searches

Requests such as `show red BMW cars`, `show jazz music`, `show vegan pasta`, `show Japan travel`, or `funny dogs, no cats` now preserve supported subjects instead of falling back to broad experience topics. Positive specifics override the default experience mix. Negative categories and specific subjects are handled separately. Only a locally recognized, canonical subject phrase is sent, never arbitrary private text from the note. Unsupported wording is identified in the UI.

Every Open TikTok click advances the related phrase, and the session-only technical counter survives closing and reopening the popup. There are six base phrase variations per category and additional specific-subject variants. A fresh browser session starts at a randomized point. This is not video deduplication: TikTok may return overlapping results for different phrases. No video metadata is read.

## Full-page view and one-tap learning

The toolbar opens ElevaTok in a full browser tab and reuses that tab when possible. Full screen in the header requests browser fullscreen; Esc or Exit full screen returns. The responsive layout keeps the latest-search feedback near the top.

More like this and Less like this apply to the last search opened through ElevaTok, even after reopening the view. One tap adjusts bounded preferences for canonical topics, subjects and phrase templates; Undo reverses the last vote before another search. Positive feedback prioritizes related choices; negative feedback reduces them. Recent templates are avoided when alternatives remain, with periodic exploration. Explicit new requests and exclusions still constrain the candidate set. More like this can follow the last supported subject when no new note is entered. The extension never reads TikTok behavior.

## Appearance

The interface now uses a neutral workspace/sidebar layout inspired by coding assistants, with a sans-serif font stack (Inter if installed, Segoe UI on Windows, then system alternatives). No proprietary app font or remotely hosted font is bundled. Buttons highlight on hover, keyboard focus is visible, and selected moods, votes and themes retain a distinct active state. Light and Dark are available in the header; your explicit theme choice is remembered in localStorage under elevatokTheme, separately from session feedback.

Twenty-one automated checks pass, including system-theme defaults, explicit theme persistence and unchanged note/search state when switching appearances. A browser screenshot preview could not run in the restricted environment because Edge GPU processes failed; live visual rendering still needs a local check.

## Cyan and pink accents

Both themes now use an ElevaTok cyan/pink/black-and-white palette inspired by the user's TikTok reference. Selected moods and navigation use cyan accents; the main action uses a high-contrast pink. The independent ElevaTok name, arrow mark, layout and non-affiliation notice are retained. No TikTok logo, branded icon, official wordmark or asset pack is included. This colour treatment is not permission from TikTok or legal clearance.

## Home and About ElevaTok

Click the ElevaTok logo, Home in the sidebar, or About ElevaTok in the footer to open a short introduction explaining the check-in, direct TikTok search and optional feedback. Start discovering or Discover returns to the same check-in without losing the current note, selected theme or prepared search. The regular toolbar still opens the check-in directly for quick use. Twenty-two automated checks pass, including navigation without losing state.

Consent demo: every page opening or toolbar revisit asks again. Agree enables personalized searches; Decline pauses them. Use Consent & data choices to pause or delete stored data and the current check-in. Returning directly from TikTok keeps feedback available.

Wellbeing loop: optionally select an overall feeling (1-5) before opening TikTok. Return to the same ElevaTok tab and enter an after feeling, release the slider to complete, or choose Skip. Improvement gently boosts related search preferences, worsening reduces them, and unchanged feelings leave weights unchanged. New searches replace any unfinished reflection. Raw ratings stay in page memory; only derived preferences persist for the session. Headspace-specific everyday tips offer offline alternatives and link to NHS wellbeing guidance. This is self-reported personalization, not a validated treatment outcome.

The check-in now moves down through seven screens. Mood buttons show emojis with hover/focus labels. Current headspace and the overall feeling slider are saved locally for the session after consent. After ratings remain in page memory. Use Delete stored data to clear saved check-ins. Rebuild the web demo with node scripts/build-web-demo.mjs after building the extension.
