# ElevaTok - legal scope of the search-only design

ElevaTok now provides a local check-in followed by a normal, user-clicked link to TikTok search results. It does not create a collection inside the extension, display TikTok content, read TikTok pages, extract metadata, modify the feed, send artificial engagement, create Favorites collections or automate the user's account. Cloudinary/video generation is not part of this version.

This removes the previous automated data-extraction path, which was the clearest platform-terms concern. TikTok's published EEA terms section 4.5 prohibit automated extraction without its software or written approval. An ordinary search link is a materially different design, but this document is not a legal opinion or approval from TikTok or Junction.

The full note and mood label remain in page memory. Only locally selected generic search terms are sent to TikTok when the user clicks. Those terms can still reveal interests. TikTok controls its results, account activity and data handling. Normal browser history can retain the destination query. No check-in is saved by ElevaTok.

The extension has no content scripts, website host permissions, embedded player or automatic website requests. A minimal background service worker opens its own interface. Its storage permission supports derived session preferences, the launcher tab identifier and explicit deletion. Optional feeling ratings stay in page memory; only their derived preference adjustments persist for the session. Keeping videos on TikTok does not itself make every possible implementation lawful: future account automation, scraping, tracking, health claims, use of actual participants' data or commercial release need separate assessment.

A saved TikTok Favorites collection is different from search results. ElevaTok does not claim to create one. Users can use TikTok's own saving tools themselves.

The QuickTok/MoodLoop and offline demo editions have been superseded in this distribution. Do not describe the current version as legally approved or GDPR certified. Check applicable national and event requirements before using it with real participants.

References:
- https://www.tiktok.com/legal/page/eea/terms-of-service/en
- https://developers.tiktok.com/docs/en/scopes-overview
- https://newsroom.tiktok.com/new-ways-for-friends-and-families-to-discover-and-discover?lang=en-GB

The current version also stores a single numeric search-rotation counter in extension browser-session memory. It contains no mood, note, topic or URL and is used only to vary related query phrases. Its use is disclosed in the privacy notice and the reset action removes it. Specific supported subject words may now be included in queries; the full note is not transmitted. Search terms can still reveal interests.

Session feedback update: the extension now retains derived topic/subject preference weights, the last ElevaTok search template and vote, recent template IDs, and a temporary Undo snapshot, plus rotation and the local interface-tab ID. These are disclosed in the privacy notice and clear with the extension session or reset. Raw notes, mood labels, URLs and TikTok browsing activity are not stored. A minimal launcher worker opens or focuses only the extension's own page; it does not perform website collection or account actions. Previous descriptions of a counter-only design or no worker are superseded by this section.

Appearance update: ElevaTok now uses its own cyan and pink accent treatment in the existing independent layout. It does not reproduce TikTok's logo, wordmark or official icons. The non-affiliation notice is retained. Similar colours are not automatically free of trademark concerns; no trademark search or legal clearance of the complete presentation has been obtained. TikTok design guidance restricts use of its brand assets and designs without permission: https://developers.tiktok.com/docs/en/getting-started-design-guidelines .
