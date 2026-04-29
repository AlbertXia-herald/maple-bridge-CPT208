# Maple Bridge Suzhou
## Final Version 0.1

Maple Bridge Suzhou is a coursework prototype for CPT208 Human-Centric Computing.  
It presents Maple Bridge Scenic Area in Suzhou through a calm, mobile-first cultural web experience with four connected pages:

- Homepage
- Interactive Map
- Photo Wall
- Notice Board
- Smart Maple Bridge

This version focuses on making the prototype clearer, more usable, and more visually coherent for demo presentation.

## Project Positioning

The project is designed for three main user groups:

- Visitors who want a quick first impression of Maple Bridge
- Visitors who want deeper exploration through playful map interaction
- Residents or community-oriented users who care about notices and activities

The overall visual direction is heritage-inspired, poetic, and lightweight rather than entertainment-heavy.

## What Is Included in Final Version 0.1

### 1. Homepage

The homepage has been refined into a cleaner overview page with lighter cognitive load.

- The hero area now uses rotating local background images from `images/homepage/`
- The hero keeps a full-width, image-led presentation without extra introductory text overload
- The guide section now includes an additional `参观须知` card
- Weather and temple/ticket information were reorganized to reduce clutter and improve hierarchy
- The top navigation continues to connect homepage sections and the other main pages

Homepage intent in this version:

- build a fast first impression
- provide practical visit information
- surface the deeper pages clearly

### 2. Interactive Map

The interactive map is the main playful exploration page and received the most iteration in this version.

Implemented interaction layers:

- Real AMap-based map surface
- Scenic hotspots with interpretation popups
- Mini-game style hotspots for temple blessing and poem interaction
- Route recommendation by time and preference

Key improvements in this version:

- Route customization now connects directly to the live map
- Clicking `按这条路线看地图` closes the route modal, scrolls to the map, and enters a route viewing state
- Scenic nodes on the selected route are highlighted with ordered route numbers
- The map auto-focuses to the selected route range when possible
- A lightweight active-route banner appears above the map and supports clearing route highlight
- Scenic interpretation popups were rebalanced so the main scenic reading text now appears to the right of the image, with highlights kept below

Image usability improvements:

- All relevant image popups now support zoom in, zoom out, reset, wheel zoom, touch pinch, and drag when enlarged
- This behavior is shared across the photo wall preview and interactive map image viewers

### 3. Photo Wall

The photo wall remains a separate page focused on browsing and community visual sharing.

- Gallery browsing is kept lightweight
- Users can preview images in a dedicated lightbox
- The preview now supports image zoom and drag for better detail viewing

This page is intentionally image-first and low-text.

### 4. Notice Board

The notice board continues to serve residents and community-focused visitors.

- The layout emphasizes clarity and scannability
- Community activities, scenic updates, and practical reminders remain separated by type
- Visual tone stays more stable and trustworthy than the playful map page

### 5. Smart Maple Bridge

The smart guide page remains a lightweight assistance layer for:

- quick direction suggestions
- route orientation
- jumping to the map, photo wall, or notice board

This version keeps it intentionally prototype-friendly and content-led.

## Interaction Highlights

The current prototype includes the following completed interaction features:

- Smooth cross-page navigation structure
- Interactive map hotspots
- Scenic information popups
- Blessing mini-game
- Poem imagery interaction
- Route recommendation and route-to-map highlighting
- Zoomable image viewers in modal contexts
- Language switching between Chinese and English
- Senior mode entry

## Tech Stack

This prototype is implemented as a lightweight static front-end:

- HTML
- CSS
- Vanilla JavaScript
- AMap Web SDK

There is no backend dependency in this version.  
Most content is mock-driven or embedded directly in front-end data structures for coursework-friendly iteration speed.

## Project Structure

Main entry files:

- `index.html` — homepage
- `interactive-map.html` — interactive map
- `photo-wall.html` — photo wall
- `notice-board.html` — notice board
- `smart-agent.html` — smart assistant page

Core behavior files:

- `script.js` — shared site behavior and i18n content
- `interactive-map.js` — map hotspots, route logic, scenic/game/poem popups
- `photo-wall.js` — gallery and lightbox behavior
- `notice-board.js` — notice board data and interactions
- `smart-agent.js` / `smart-agent-data.js` — smart guide interaction and content
- `zoomable-image-viewer.js` — shared image zoom viewer

Assets:

- `images/` — page visuals, ticket image, homepage hero images, map scene images
- `audio/` — optional audio assets
- `assets/` — additional static resources

## How to Open the Project

This version does not require a build pipeline.

Recommended ways to run:

1. Open `index.html` directly in a browser for static browsing
2. Prefer using a local static server if the browser blocks some resource behavior
3. Open `interactive-map.html` directly when testing map interactions

If the real map fails to load:

- check network access
- check browser console
- confirm AMap key availability

## Current Version Notes

Final Version 0.1 is a polished prototype, not a production release.

Known scope characteristics:

- Content is primarily front-end managed
- Upload behavior remains lightweight and prototype-oriented
- No authentication, database, or admin system is included
- Some practical information is intentionally simplified for demo stability

## Recommended Demo Path

For presentation, a smooth walkthrough is:

1. Open homepage and show overall visual direction
2. Enter interactive map and demonstrate hotspot popups
3. Show route recommendation and map route highlighting
4. Demonstrate blessing / poem interaction
5. Open photo wall and zoom into a preview image
6. End with notice board and smart guide entry

## Version Label

Document name:

- `README_final_version_0.1.md`

Project state described here corresponds to the current repository state of Final Version 0.1.
