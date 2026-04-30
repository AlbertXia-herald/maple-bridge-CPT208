# Maple Bridge Suzhou
## Final Version 1.0

Maple Bridge Suzhou is a coursework prototype for CPT208 Human-Centric Computing.  
It presents Maple Bridge Scenic Area in Suzhou through a calm, mobile-first cultural web experience with five connected pages:

- Homepage
- Interactive Map
- Photo Wall
- Notice Board
- Smart Maple Bridge

Final Version 1.0 represents the polished submission version of the prototype.  
This round focuses on consistency, mobile usability, smoother cross-page experience, and clearer practical guidance, while keeping the project fully static and coursework-friendly.

## Project Positioning

The project is designed for three main user groups:

- Visitors who want a quick first impression of Maple Bridge
- Visitors who want deeper exploration through interactive content
- Residents or community-oriented users who care about notices and practical updates

The overall experience remains poetic, heritage-inspired, lightweight, and mobile-first rather than feature-heavy.

## What Is Included in Final Version 1.0

### 1. Homepage

The homepage is now more stable, more informative, and more presentation-ready across desktop and mobile.

Key homepage updates:

- The hero area was refined so its width stays aligned with the top navigation
- Homepage background images now behave more gracefully on mobile and preserve a more complete visual presentation
- A four-dot indicator was added below the rotating homepage background to show the active hero image
- The `参观须知` block was rewritten for clearer reading and corrected list semantics
- Bullet alignment, spacing, and mobile rhythm in the `参观须知` section were tuned further
- The travel card now includes `详情` buttons for metro, bus, and driving
- Travel detail buttons were moved to the right side of each travel item for a cleaner information layout
- Clicking a travel detail button opens a dedicated bottom sheet with more detailed route guidance

Homepage intent in this final version:

- deliver a fast first impression
- keep the visual structure elegant and stable on mobile
- provide practical visit support without overloading the first screen
- connect users smoothly to the deeper standalone pages

### 2. Interactive Map

The interactive map remains the main playful exploration page and received important usability refinements in this final version.

Key updates:

- The page transition flash was reduced by stabilising asset loading and improving map loading states
- The map now uses a clearer loading-to-ready transition instead of briefly feeling broken while assets are still preparing
- On touch devices, the gesture logic was improved so single-finger vertical movement scrolls the page, while two-finger interaction controls the map
- Existing scenic hotspots, mini-game interactions, route recommendation, and route highlighting remain intact

This makes the map page feel more deliberate and less frustrating on mobile.

### 3. Photo Wall

The photo wall continues to serve as the image-first atmosphere page in the system.

- Users can browse shared Maple Bridge imagery
- The page remains visually lighter than the map and notice board
- It continues to support a calm transition from visual browsing into deeper exploration

No structural redesign was introduced here in this version; it remains the soft visual complement of the overall prototype.

### 4. Notice Board

The notice board was further refined into a more believable resident-facing static information page.

Key improvements:

- Notice content was updated based on `assets/brand/公告栏内容.xlsx`
- The main notice list now reflects resident, scenic operation, and service-oriented content more clearly
- The `重要提醒` area was simplified to keep only two highlighted notices
- The first highlighted notice is now fixed to the primary scenic operation notice
- Notice details include fuller body content, audience, status, notes, and source links where available
- Archived or ended notices remain visible in the main list for completeness but are no longer treated as active reminders

This keeps the page practical, trustworthy, and easier to scan.

### 5. Smart Maple Bridge

Smart Maple Bridge is now positioned as a lightweight local agent rather than a shortcut-only page.

Key improvements:

- A local FAQ knowledge base supports common visitor questions without any backend or external AI API
- The assistant can answer common questions about transport, tickets, opening hours, visitor notes, route planning, scenic spots, photo wall, and cultural background
- Suggested-question chips, category filters, and a `热门问题` section help users reach answers quickly
- Fallback handling now returns useful guidance instead of leaving unmatched questions empty
- Internal links guide users toward the interactive map, photo wall, and notice board where appropriate
- The page wording was unified from `静态 FAQ Agent` to `智能枫桥 Agent`
- The hero area was simplified by removing the right-side direction card and rebalancing the left typography
- The smart-agent hero now feels more consistent with the other standalone pages and lets users reach the FAQ area faster, especially on mobile

This version keeps the assistant fully static, but makes it feel significantly more useful and coherent in demo use.

## Cross-Page Refinements

This version also includes a number of consistency improvements across the project:

- Text changes were synchronised into the final rendered i18n output instead of only changing default HTML text
- Hero layout language across standalone pages is now more visually consistent
- Mobile spacing and typography were tuned in several practical areas
- Project ignore rules were improved for cleaner GitHub submission readiness

## Interaction Highlights

The final prototype includes the following completed interaction features:

- Smooth cross-page navigation structure
- Rotating homepage hero background with active-position indicator dots
- Mobile-adapted homepage hero presentation
- Homepage travel detail bottom sheet
- Interactive map hotspots
- Scenic information popups
- Blessing mini-game
- Poem imagery interaction
- Route recommendation and route-to-map highlighting
- Touch-friendly two-finger map control on mobile
- Zoomable image viewers in modal contexts
- Static local FAQ agent with keyword matching
- Language switching between Chinese and English
- Senior mode entry

## Tech Stack

This prototype is implemented as a lightweight static front-end:

- HTML
- CSS
- Vanilla JavaScript
- AMap Web SDK

There is still no backend dependency in this final version.  
Most content remains mock-driven or embedded directly in front-end data structures for fast coursework iteration and presentation stability.

## Project Structure

Main entry files:

- `index.html` — homepage
- `interactive-map.html` — interactive map
- `photo-wall.html` — photo wall
- `notice-board.html` — notice board
- `smart-agent.html` — smart assistant page

Core behavior files:

- `script.js` — shared site behavior, homepage interactions, and i18n content
- `interactive-map.js` — map hotspots, route logic, scenic/game/poem popups, and touch-map behavior
- `photo-wall.js` — gallery and lightbox behavior
- `notice-board.js` — notice board data and interactions
- `smart-agent.js` / `smart-agent-data.js` — FAQ agent interaction and local knowledge base
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

Final Version 1.0 is still a polished coursework prototype rather than a production release.

Known scope characteristics:

- Content is primarily front-end managed
- Upload behavior remains lightweight and prototype-oriented
- No authentication, database, or admin system is included
- Smart Maple Bridge is a local knowledge-based assistant, not a live LLM
- Ticketing, opening hours, and route details should still be treated as demo-oriented guidance unless re-confirmed through official channels

## Recommended Demo Path

For presentation, a smooth walkthrough is:

1. Open the homepage and show the rotating hero, indicator dots, and travel detail interactions
2. Enter Smart Maple Bridge and demonstrate common FAQ questions and suggestion chips
3. Open the interactive map and show hotspot popups, route recommendation, and improved mobile gesture logic
4. Show the photo wall as the visual atmosphere page
5. End with the notice board and its refined two-item `重要提醒` area

## Version Label

Document name:

- `README_final_version_1.0.md`

Project state described here corresponds to the current repository state of Final Version 1.0.
