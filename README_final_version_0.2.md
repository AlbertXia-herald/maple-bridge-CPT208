# Maple Bridge Suzhou
## Final Version 0.2

Maple Bridge Suzhou is a coursework prototype for CPT208 Human-Centric Computing.  
It presents Maple Bridge Scenic Area in Suzhou through a calm, mobile-first cultural web experience with five connected pages:

- Homepage
- Interactive Map
- Photo Wall
- Notice Board
- Smart Maple Bridge

Final Version 0.2 focuses on making the prototype feel more complete, more practical for visitors, and more presentation-ready, while still keeping the project fully static and coursework-friendly.

## Project Positioning

The project is designed for three main user groups:

- Visitors who want a quick first impression of Maple Bridge
- Visitors who want deeper exploration through playful map interaction
- Residents or community-oriented users who care about notices and activities

The overall visual direction remains heritage-inspired, poetic, lightweight, and mobile-first rather than entertainment-heavy.

## What Is Included in Final Version 0.2

### 1. Homepage

The homepage has received the largest practical usability refinements in this version.

Key homepage updates:

- The hero area was improved for mobile adaptation so the header width and hero width stay visually aligned
- The homepage hero now uses a softer mobile display strategy for background images and keeps the visual crop more stable on small screens
- A four-dot hero indicator was added below the rotating homepage background so users can see which of the four images is currently active
- The `参观须知` card was refined with cleaner text and corrected list structure for better readability
- Dot alignment, spacing, and mobile rhythm in the `参观须知` block were tuned further
- The travel card now includes `详情` buttons for metro, bus, and driving
- Clicking a travel detail button opens a dedicated bottom sheet with more complete route guidance
- Travel detail buttons were repositioned to the right side of each line for a cleaner information layout on desktop and mobile

Homepage intent in this version:

- build a fast first impression
- keep the first screen elegant and stable on mobile
- provide clearer practical visit support
- surface deeper pages without making the homepage too heavy

### 2. Interactive Map

The interactive map remains the main playful exploration page and keeps the interaction system from the previous version.

Included interaction layers:

- Real AMap-based map surface
- Scenic hotspots with interpretation popups
- Mini-game style hotspots for temple blessing and poem interaction
- Route recommendation by time and preference
- Zoomable image viewing in popup contexts

This version does not redesign the map page structurally, but it remains connected more clearly from the homepage and smart assistant flows.

### 3. Photo Wall

The photo wall continues to serve as a separate image-first browsing page.

- Users can browse shared Maple Bridge imagery
- Preview interactions remain lightweight and image-focused
- The page continues to work as a soft atmospheric complement to the more structured homepage and map experiences

### 4. Notice Board

The notice board was upgraded from placeholder-oriented content into a more realistic, resident-facing static information page.

Key improvements:

- Notice content was updated based on `assets/brand/公告栏内容.xlsx`
- The main notice list now reflects the imported resident and community-oriented content
- `重要提醒` was refreshed to prioritize notices that still have current reference value
- Notice details were expanded to include fuller body content, status context, notes, and source links where available
- Expired or archived notices remain visible for completeness, but are no longer treated as active highlights

This keeps the page practical, trustworthy, and better aligned with the resident-use scenario.

### 5. Smart Maple Bridge

Smart Maple Bridge was significantly upgraded in this version.

It is no longer just a lightweight shortcut panel.  
It now works as a static FAQ-style assistant with local knowledge matching.

Key improvements:

- A local FAQ knowledge base was added in JavaScript
- The assistant now covers visitor topics such as transport, tickets, opening hours, visitor notes, route planning, scenic spots, photo wall, and cultural background
- The assistant supports keyword matching in Chinese and simple English
- Users can type a question and receive the best-matching FAQ answer
- If there is no good match, the assistant returns a helpful fallback response instead of doing nothing
- Suggested-question chips were added for quick interaction
- Category filter chips and a `热门问题` section were added
- Answers now include useful internal links to the interactive map, photo wall, and notice board where relevant
- The same FAQ assistant logic is reused in the homepage assistant modal
- The hero heading of the smart-agent page was rebalanced to better fill the left side and stay visually consistent with the other standalone pages

This version makes Smart Maple Bridge feel more useful during demo and testing, even without any backend or live AI API.

## Interaction Highlights

The current prototype includes the following completed interaction features:

- Smooth cross-page navigation structure
- Rotating homepage hero background with active-position indicator dots
- Mobile-adapted homepage hero presentation
- Travel detail bottom sheet on the homepage
- Interactive map hotspots
- Scenic information popups
- Blessing mini-game
- Poem imagery interaction
- Route recommendation and route-to-map highlighting
- Zoomable image viewers in modal contexts
- Static FAQ assistant with keyword matching
- Language switching between Chinese and English
- Senior mode entry

## Tech Stack

This prototype is implemented as a lightweight static front-end:

- HTML
- CSS
- Vanilla JavaScript
- AMap Web SDK

There is still no backend dependency in this version.  
Most content remains mock-driven or embedded directly in front-end data structures for fast coursework iteration.

## Project Structure

Main entry files:

- `index.html` — homepage
- `interactive-map.html` — interactive map
- `photo-wall.html` — photo wall
- `notice-board.html` — notice board
- `smart-agent.html` — smart assistant page

Core behavior files:

- `script.js` — shared site behavior, homepage interactions, and i18n content
- `interactive-map.js` — map hotspots, route logic, scenic/game/poem popups
- `photo-wall.js` — gallery and lightbox behavior
- `notice-board.js` — notice board data and interactions
- `smart-agent.js` / `smart-agent-data.js` — FAQ assistant interaction and local knowledge base
- `zoomable-image-viewer.js` — shared image zoom viewer

Assets:

- `images/` — page visuals, homepage hero images, map scene images, gallery imagery
- `audio/` — optional audio assets
- `assets/` — additional static resources, including notice-board source material

## How to Open the Project

This version does not require a build pipeline.

Recommended ways to run:

1. Open `index.html` directly in a browser for static browsing
2. Prefer using a local static server if the browser blocks some resource behavior
3. Open `interactive-map.html` directly when testing map interactions
4. Open `smart-agent.html` directly when testing FAQ interactions

If the real map fails to load:

- check network access
- check browser console
- confirm AMap key availability

## Current Version Notes

Final Version 0.2 is still a polished prototype rather than a production release.

Known scope characteristics:

- Content is primarily front-end managed
- Upload behavior remains lightweight and prototype-oriented
- No authentication, database, or admin system is included
- The Smart Maple Bridge assistant is a local FAQ system, not a live LLM
- Ticketing, opening hours, and route details should still be treated as demo-oriented guidance unless re-confirmed through official channels

## Recommended Demo Path

For presentation, a smooth walkthrough is:

1. Open the homepage and show the rotating hero with indicator dots
2. Demonstrate the homepage travel detail buttons and bottom sheet
3. Enter Smart Maple Bridge and ask several FAQ questions
4. Open the interactive map and demonstrate hotspot popups and route recommendation
5. Show the photo wall as the atmosphere-focused page
6. End with the updated notice board and its refreshed important reminders

## Version Label

Document name:

- `README_final_version_0.2.md`

Project state described here corresponds to the current repository state of Final Version 0.2.
