---
name: maple-resident-board
description: Use this skill only when implementing or refining the Maple Bridge resident-oriented notice board page, including cultural activities, scenic-area announcements, management updates, and practical information structure. Do not use this skill for homepage navigation, photo wall gallery layout, or interactive map hotspot gameplay.
---

## Goal
Build a resident-oriented notice board page for Maple Bridge.

This page serves residents and community-aware users.
It should present practical, trustworthy, and easy-to-scan information related to local activities and scenic-area updates.

## Core responsibilities
The notice board page should:
- display cultural activity announcements
- display scenic-area management updates
- support practical reading and scanning
- feel more structured and informative than playful

## Content categories
Prefer separating notice board content into clear groups such as:
- Cultural activities
- Community events
- Scenic-area operation or management updates
- Public notices or reminders

If full categorization is not yet available, structure the page so it can support these groups later.

## Design rules
- prioritize clarity and trust
- use a readable list or card structure
- preserve visual consistency with the project
- avoid excessive playful decoration
- support quick scanning by residents
- emphasize titles, dates, and notice type

## UX priorities
- residents should quickly identify relevant updates
- event-style content and management-style content should not feel mixed up
- reading should be effortless on mobile
- page structure should feel practical and dependable

## Recommended content structure
Each notice item should ideally support:
- title
- category
- date
- short summary
- optional detail link or expand behavior

## Implementation guidance
- use mock data if real notice data is not ready
- keep content schema simple and reusable
- prefer a structure that can later connect to API or CMS data
- allow future filtering without overengineering the current version

## Accessibility requirements
- strong heading hierarchy
- readable font size and spacing
- distinguish notice types without relying only on color
- clear labels for buttons or expand actions

## Done when
This skill is complete only if:
- the page clearly serves residents
- notices are structured and easy to scan
- cultural and management information are presented clearly
- the page feels trustworthy and practical
- the implementation remains easy to extend later