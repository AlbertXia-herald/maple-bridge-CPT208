# AGENTS.md

## Project identity
This project is a coursework prototype for CPT208 Human-Centric Computing.

Project theme:
Maple Bridge (枫桥) playful heritage mobile web app.

Core positioning:
- A clean, efficient homepage for users who only want a quick first impression.
- A standalone photo wall page for user-uploaded photos.
- An interactive map page for visitors who want deeper, playful exploration.
- A resident-oriented notice board page for cultural events and management updates.

Primary user groups:
- Visitors: especially users who want to explore Maple Bridge more deeply through interactive content.
- Residents: users who care about local announcements, cultural activities, and community-related updates.
- Lightweight homepage users: users who only want a fast overview without entering deeper interaction flows.

## Product goals
The system should communicate Maple Bridge clearly, beautifully, and efficiently, while also supporting a second layer of deeper playful interaction.

The website must balance:
1. Human-centered clarity
2. Playful interaction
3. Visual elegance
4. Mobile-first usability
5. Coursework-friendly prototype scope

## Information architecture
The website has four main pages:

1. Homepage
   Purpose:
   - First-touch landing page
   - Clean, efficient, low-cognitive-load overview
   - Suitable for users who only want initial information

   Homepage sections should include:
   - Overall introduction
   - Agent / intelligent assistant entry or placeholder
   - Route planning / exploration guidance
   - Entrances to photo wall, interactive map, and notice board

   Navigation:
   - The homepage has a top-right navigation bar
   - It should support smooth scrolling to homepage sections
   - It should also provide access to the other three main pages

2. Photo Wall
   Purpose:
   - A separate page for displaying uploaded user photos
   - Focus on visual presentation and community contribution
   - Should feel open, lively, and easy to browse

3. Interactive Map
   Purpose:
   - A deeper exploration page for visitors
   - Users can click different map hotspots
   - Different hotspots open either:
     - scenic information popups
     - mini-game popups
   - This page is the main playful interaction page

4. Notice Board
   Purpose:
   - A resident-oriented page
   - Shows cultural activities, scenic-area notices, and management updates
   - Should feel practical, trustworthy, and readable

## Design principles
All implementation decisions should follow these principles:

### Overall
- Mobile-first
- Elegant and calm visual atmosphere
- Heritage-inspired but modern
- Clean hierarchy
- Fast comprehension
- Avoid clutter
- Avoid overengineering

### Homepage
- Keep the page pure and focused
- Prioritize efficient information delivery
- Do not overload the homepage with too many interaction details
- Make the four-page structure obvious
- Ensure the navigation is clear and lightweight

### Photo Wall
- Emphasize images rather than long text
- Support future upload flow, even if current version uses mock data
- The gallery should feel visually cohesive
- Avoid messy spacing and uneven image presentation

### Interactive Map
- Prioritize the playful experience
- Hotspots must be obvious and clickable
- Popups must be readable, focused, and easy to close
- Scenic info popup and mini-game popup should feel related but distinct
- The page should support progressive exploration rather than dumping all content at once

### Notice Board
- Prioritize clarity and trustworthiness
- Resident-related content should look structured and easy to scan
- Separate cultural activities from management / operational notices when possible
- Avoid overly playful visuals that reduce seriousness

## Accessibility and usability
The system must maintain a solid baseline of accessibility and usability.

Required:
- Semantic HTML
- Readable heading hierarchy
- Sufficient text contrast
- Large touch targets on mobile
- Alt text for meaningful images
- Aria labels for icon-only controls
- Keyboard-friendly modal open/close behavior where practical
- Do not rely only on color to express state
- Avoid tiny text on mobile
- Avoid dense blocks of text

## Engineering guidance
- Prefer React + TypeScript + Vite if scaffolding a new front-end
- Prefer reusable components
- Prefer small, readable files over large monolithic ones
- Avoid heavy dependencies unless clearly justified
- Use mock data first if real backend is not ready
- Do not add backend complexity unless explicitly requested
- Use placeholder content where needed, but structure it for easy replacement later

## What Codex should optimize for
When making choices, optimize in this order:
1. Correct page structure
2. Mobile usability
3. Visual coherence
4. Extensibility
5. Nice animation
6. Technical complexity

## Constraints
- This is an early-stage coursework prototype, not a production system
- Build the minimum architecture that can still scale to the final demo
- Do not implement unnecessary authentication, database, or admin systems unless explicitly requested
- For uploads, lightweight placeholder or simulated upload behavior is acceptable in the prototype stage
- For map interactions, hotspot + modal interaction is preferred over overly complex map engines in the initial version

## Visual direction
Target mood:
- poetic
- calm
- culturally grounded
- lightweight
- modern
- immersive but not overloaded

Avoid:
- childish game style
- excessive neon or cyber aesthetics
- crowded cards
- dark overlays that hurt readability
- giant paragraphs on the homepage

## Acceptance criteria
A task is considered done only if:
- The four-page structure is preserved
- The homepage remains clean and efficient
- The homepage top-right navigation works clearly
- The entrances to the later three pages are visible from the homepage
- The photo wall can visually present a gallery cleanly
- The interactive map supports hotspot-triggered popups
- At least two popup types are supported on the map:
  - scenic information
  - mini-game or playful interaction
- The notice board clearly serves residents
- The layout works well on mobile widths
- The code remains readable and easy to extend

## Task behavior expectations
Before major changes:
- explain the plan briefly

During implementation:
- keep changes scoped
- prefer editing existing files when possible
- do not rewrite unrelated sections

After implementation:
- summarize what changed
- mention any assumptions
- mention any remaining placeholders