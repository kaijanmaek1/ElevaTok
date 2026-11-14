# ElevaTok - start here

## Install and open

Extract this ZIP, open edge://extensions or chrome://extensions, enable Developer mode, select Load unpacked and choose the extracted dist folder. Click ElevaTok in the browser's Extensions menu.

ElevaTok opens in a full browser tab instead of a popup. Repeated toolbar clicks reuse its own tab when available. Click Full screen in the header to hide browser chrome; click Exit full screen or press Esc to return.

For an existing installation, reload the extension, close old ElevaTok tabs, and reopen it from the toolbar. Refresh TikTok tabs from earlier live-filter versions.

## Search and feedback

1. Choose a mood and what would feel good right now.
2. Optionally write `show red BMW cars`, `show jazz music`, or `funny dogs, no cats`.
3. Click Open TikTok to open related results directly, without a phrase-preview step.
4. Return to the ElevaTok tab. Your note remains while that tab is open.
5. Tap More like this or Less like this at the top to rate that search. It immediately adjusts related future searches. Undo reverses the vote.
6. Click Open TikTok again for an adapted search, or change your interests for a new direction.

Feedback can also be given after closing and reopening the view: the last supported topic and preferences stay in browser-session memory. More like this can prepare a related follow-up even without retyping the old note. Notes themselves are not saved. Explicit new requests and exclusions take priority over learning.

Each click rotates related phrases, with some exploration retained. TikTok may still return the same videos. Feedback is about the last search opened through ElevaTok; the extension does not read TikTok behavior or rate individual videos.

## Privacy

The raw note and mood label stay in the open page. Session storage holds derived topic preferences, recent template identifiers, latest search feedback, a rotation number and the extension's own view-tab identifier. No raw note, mood label, search URL or actual TikTok browsing history is stored. Reset feedback and delete previous data clears learned data and old-version keys.

Only generated topic words are sent to TikTok when you click Open TikTok. TikTok controls its results and privacy practices. There are no content scripts, host permissions, video collection, scraping, live filtering, account automation or Cloudinary generation. The launcher worker only opens ElevaTok's own page. This independent prototype is not medical care or legally certified. Read Privacy for details.

No npm or GitHub account is needed. Source and build instructions are in README.md.

## Light and dark appearance

Use Light or Dark at the top right. Your choice is remembered on this device. With no saved choice, the view follows the system preference at startup. Hover highlights buttons; selected moods, feedback and themes remain visibly highlighted. The interface uses a local sans-serif font and a neutral sidebar layout. Reload the extension and reopen its view to get this redesign.

## Home and About ElevaTok

Click the ElevaTok logo, Home in the sidebar, or About ElevaTok in the footer to open a short introduction explaining the check-in, direct TikTok search and optional feedback. Start discovering or Discover returns to the same check-in without losing the current note, selected theme or prepared search. The regular toolbar still opens the check-in directly for quick use. Twenty-two automated checks pass, including navigation without losing state.

Consent demo: every page opening or toolbar revisit asks again. Agree enables personalized searches; Decline pauses them. Use Consent & data choices to pause or delete stored data and the current check-in. Returning directly from TikTok keeps feedback available.
