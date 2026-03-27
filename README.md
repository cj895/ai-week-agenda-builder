# AI Week Agenda Builder

A world-class agenda management dashboard for **Atlanta AI Week 2026**, built for the Enterprise Technology Association (ETA). Designed to make building, managing, and exporting a multi-day conference agenda effortless.

![ETA Brand](https://img.shields.io/badge/ETA-AI%20Week%202026-0047FF?style=for-the-badge)

## Features

- **Visual Session Management** — Add, edit, duplicate, and delete sessions with a polished modal interface
- **Speaker Placement** — Attach speakers to any session inline
- **Pre-Populated Agenda** — Ships with a complete 3-day, 90+ session Atlanta AI Week agenda
- **10 Color-Coded Tracks** — Matching ETA's official brand color system
- **9 Stages** — All Atlanta AI Week venues pre-loaded
- **11 Session Types** — Keynote, Panel, Workshop, Fireside Chat, Roundtable, Demo, and more
- **48 Tags** — Split into Topic Tags and Audience/Format Tags for precise attendee filtering
- **Smart Scheduling Rules** — Days 2 & 3 open with Main Stage–only programming (9:00–11:30 AM), concurrent breakouts after, 10-min buffers between sessions
- **Search & Filter** — Filter by track, stage, session type, or search across titles, speakers, and descriptions
- **Eventify CSV Export** — One-click export with all 33 Eventify columns, correct colors, proper quoting
- **CSV Import** — Drop in an existing Eventify CSV to populate the dashboard
- **Persistent Storage** — Sessions save automatically and persist across browser sessions

## Tracks

| Track | Color |
|-------|-------|
| Startup Showcase | `#00C2FF` on `#001324` |
| Community Networking | `#00E0B8` on `#001324` |
| AI Strategy & Use Cases | `#0084FF` on `#FFFFFF` |
| AI Adoption & Change Management | `#5B8CFF` on `#FFFFFF` |
| Data Readiness & Infrastructure | `#7A5CFF` on `#FFFFFF` |
| Architecture, Models & Technical Stack | `#4B3BFF` on `#FFFFFF` |
| AI in Action | `#006DFF` on `#FFFFFF` |
| Executive Governance & Organizational Alignment | `#1F3A5F` on `#FFFFFF` |
| AI Security, Risk & Compliance | `#003B8E` on `#FFFFFF` |
| AI for Marketing, Operations & Productivity | `#00A3A3` on `#001324` |

## Stages

1. ATV Main Stage
2. ATV Lennox Boardroom
3. ATV Pitch Practice Room
4. Roam Buckhead Garage
5. Roam Forum
6. TechRise Stage
7. ATV Roundtable Room 1
8. ATV Roundtable Room 2
9. ATV Community Room

## Event Schedule

- **Day 1 (Apr 20)** — Community Day: Startup Showcase + Happy Hour @ TechSquare Club
- **Day 2 (Apr 21)** — Are We Ready?: Full conference day, Main Stage morning → concurrent breakouts
- **Day 3 (Apr 22)** — How Do We Implement?: Women in AI Breakfast → Main Stage → breakouts

## Tech Stack

- React (functional components + hooks)
- Tailwind-style utility CSS (inline, no build step)
- Poppins / DM Sans / JetBrains Mono typography
- Persistent storage API
- CSV export/import

## Usage

This component is designed to run as a **React artifact** in Claude.ai. To use it:

1. Open the `.jsx` file in Claude's artifact viewer
2. The dashboard loads with the pre-populated Atlanta AI Week agenda
3. Click any session card to edit, add speakers, or change tags
4. Use **+ Add Session** to create new sessions
5. Click **↓ Export CSV** to generate the Eventify-ready file

## File Structure

```
src/
  AgendaBuilder.jsx    # Main dashboard component (self-contained)
```

## Brand

Built on the **ETA Design System**:
- Colors: Prussian Blue `#001324`, Azure `#0084FF`, Aquamarine `#00FFD9`, Full Spectrum `#0047FF`
- Typography: Poppins (headings), DM Sans (body), JetBrains Mono (timestamps)
- Border radius: 16px components, 25px buttons/pills

---

**Enterprise Technology Association** — [joineta.org](https://joineta.org) | [joinaiweek.com](https://joinaiweek.com)
