---
name: maple-homepage
description: Use this skill only when building or refining the Maple Bridge homepage, including its top-right section navigation, overall introduction, agent entry, route planning section, and homepage entrances to the photo wall, interactive map, and notice board. Do not use this skill for implementing the standalone photo wall, the interactive map logic, or the resident notice board internals.
---

## Goal
Build a clean, high-clarity homepage for the Maple Bridge project.

The homepage is for users who only want an efficient first impression and quick understanding of the project.
It must remain visually pure, calm, and low in cognitive load.

## Homepage responsibilities
The homepage should:
- introduce the project clearly
- establish visual identity
- provide lightweight understanding of Maple Bridge
- offer access points to deeper pages
- support top-right navigation that helps users jump to sections
- avoid overloading users with too much detail

## Required homepage content
The homepage should include:
1. Overall introduction
2. Agent or assistant entry / placeholder
3. Route planning or exploration guidance
4. Entrances to:
   - Photo Wall
   - Interactive Map
   - Notice Board

## Navigation rules
- There should be a top-right navigation area
- It should support smooth scrolling to homepage sections
- It should also provide clear access to the other three pages
- It should be visually lightweight and not dominate the page

## Design rules
- Keep the homepage pure and uncluttered
- Prioritize strong typography hierarchy
- Use short content blocks
- Keep the first screen highly readable
- Do not turn the homepage into a dense dashboard
- Do not embed full resident notice lists or full photo wall content directly on the homepage
- Use preview-style sections for secondary content
- Keep calls to action clear

## UX priorities
- Users should understand the website structure quickly
- Users should know where to go next
- Users should not feel forced into deeper interaction
- The homepage should support both quick overview and page routing

## Implementation guidance
- Prefer reusable section components
- Prefer anchor-based or controlled smooth-scroll navigation
- Use responsive spacing and clear section separation
- Ensure mobile layout still keeps the navigation understandable
- Keep buttons and links clearly distinguishable

## Accessibility requirements
- Use semantic sections and headings
- Provide clear labels for navigation items
- Ensure scroll targets align correctly
- Ensure buttons or links have adequate touch size
- Preserve readable contrast

## Done when
This skill is complete only if:
- the homepage is visually clean
- the section hierarchy is obvious
- the top-right navigation works
- the three deeper pages are reachable from the homepage
- the homepage feels like an overview page, not a content dump