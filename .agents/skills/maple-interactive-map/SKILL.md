---
name: maple-interactive-map
description: Use this skill only when implementing or refining the Maple Bridge interactive map page, including clickable map hotspots, scenic information popups, and mini-game or playful interaction popups. Do not use this skill for the homepage overview, the standalone photo wall gallery, or the resident notice board.
---

## Goal
Build the main playful interaction page for Maple Bridge visitors.

This page should support deeper exploration.
Users interact with the map by clicking different hotspots.
Different hotspots open different popup types:
- scenic information popup
- mini-game or playful interaction popup

## Core responsibilities
The interactive map page should:
- present a map or map-like exploration surface
- display clearly clickable hotspots
- support multiple popup types
- make exploration feel progressive and playful
- help visitors engage more deeply with scenic and cultural content

## Interaction model
Base interaction:
1. user sees the map
2. user identifies a hotspot
3. user taps or clicks a hotspot
4. a popup opens
5. popup content depends on hotspot type

Supported popup types:
- Scenic information popup
  - concise scenic content
  - short description
  - cultural or historical highlights
  - optional image or icon

- Mini-game / playful popup
  - lightweight and quick to understand
  - suitable for prototype implementation
  - should not require complex game engines
  - should reinforce playful engagement

## Scope control
For the first version:
- simple hotspot + modal architecture is preferred
- avoid heavy GIS or advanced map engines unless explicitly requested
- do not overbuild game logic
- prioritize a clean playable prototype

## Design rules
- hotspots must look interactive
- popup open and close behavior must be clear
- popup content should be focused and not too long
- the map page should feel more exploratory than the homepage
- playful features should feel culturally grounded rather than random

## UX priorities
- users should immediately understand that the map is interactive
- hotspots should invite exploration
- the difference between information popup and mini-game popup should be easy to perceive
- the page should reward curiosity
- interaction should remain understandable on mobile

## Recommended technical approach
- use structured hotspot data
- classify hotspots by type
- render popup content by hotspot category
- keep content data separate from presentation where possible
- use reusable modal or popup components

## Accessibility requirements
- hotspots must have clear labels where practical
- modals should have obvious close controls
- modal state should be understandable
- important content should not depend only on hover
- interaction must work for touch users

## Done when
This skill is complete only if:
- the page presents an interactive map surface
- users can click multiple hotspots
- at least two popup types exist
- popup behavior is clear and usable
- the page feels playful and visitor-oriented
- the implementation is scalable for later content expansion