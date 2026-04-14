# HNG Stage 1A: Advanced Stateful Todo Card

This is my submission for the HNG Stage 1A task. It builds on the previous HTML/CSS design but transforms it into a fully interactive React component.

**Live Demo:** [Insert Vercel Link Here]
**GitHub Repository:** [Insert Repo Link Here]

## What Changed from Stage 0
* **Moved to React:** I migrated the project from vanilla JavaScript to a React (Vite) setup. Handling the two-way state syncing between the checkbox and the status dropdown was getting too complex for plain JS, so React's state management made things much cleaner.
* **Dynamic Time Tracking:** The static dates from Stage 0 are gone. I built a custom `useEffect` interval that calculates the time remaining every 30 seconds and automatically flags the task as "Overdue" when the deadline passes.

## Design Decisions
* **Tailwind v4:** I used the brand new Tailwind v4 engine to handle the styling. It allowed me to keep the responsive layout fluid without needing any bulky config files.
* **Visual Cues:** To keep the UI clean, I used colored left-border accents to indicate priority (red for high, yellow for medium) instead of taking up space with extra badges. When a task is marked "Done", the entire card drops in opacity to visually push it out of focus.
* **Inline Editing:** Instead of using a clunky modal popup for editing tasks, I built an inline form that smoothly replaces the card's content.

## Accessibility Notes
* **Keyboard Flow:** I put a lot of focus on keyboard navigation. When you cancel or save an edit, a `useRef` hook automatically throws your focus back to the edit button so you don't lose your place on the page.
* **Screen Readers:** The time-remaining text updates dynamically, so I added `aria-live="polite"` to ensure screen readers announce the changes without interrupting the user.

## Known Limitations
Everything currently runs on local React state. Because I haven't wired up a database or local storage yet, refreshing the page will reset the card back to the default mock data.

## How to Run Locally
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`