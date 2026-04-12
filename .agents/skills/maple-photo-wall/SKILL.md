---
name: maple-photo-wall
description: Use this skill only when implementing or refining the standalone Maple Bridge photo wall page, including gallery layout, visual presentation of uploaded photos, lightweight upload placeholders, and browsing experience. Do not use this skill for homepage structure, interactive map hotspot logic, or resident notice board content.
---

## Goal
Build a standalone photo wall page for Maple Bridge.

This page is for displaying user photos in a visually appealing and community-oriented way.
It should be image-first, easy to browse, and easy to extend later with real upload functionality.

## Core responsibilities
The photo wall page should:
- display uploaded or mock user photos
- support a clean gallery experience
- leave room for a future upload flow
- feel separate from the homepage in both focus and purpose

## Product assumptions
At the prototype stage:
- mock photo data is acceptable
- simulated upload UI is acceptable
- local preview behavior is acceptable
- backend integration is not required unless explicitly requested

## Design rules
- prioritize images over text
- keep captions short
- maintain clean spacing and alignment
- avoid visually chaotic layouts
- make the page feel alive but still elegant
- do not overload the page with management controls

## Recommended layout behavior
- use a responsive gallery or masonry-like presentation only if stable
- prefer consistent card behavior
- ensure images display well on mobile
- avoid severe cropping of key image content
- ensure the page remains visually balanced even with mixed aspect ratios

## Upload behavior guidance
If upload UI is included:
- keep it lightweight
- present it as a simple action such as:
  - upload a photo
  - share your Maple Bridge moment
- clearly distinguish upload controls from the gallery itself
- do not build a heavy account system

## UX priorities
- browsing should feel effortless
- images should be the main storytelling surface
- community participation should be visible
- the page should encourage emotional connection to Maple Bridge

## Accessibility requirements
- meaningful images should have alt text
- controls should be clearly labeled
- touch targets should be large enough on mobile
- empty states should still be understandable

## Done when
This skill is complete only if:
- the page works as a standalone photo wall
- the gallery is visually clean
- upload or upload-placeholder behavior is easy to understand
- the page feels community-driven and image-first
- the implementation is easy to connect to real data later