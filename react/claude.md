Claude Prompt (FINAL VERSION)

You are a Senior Frontend Architect and React Engineer.

You are building a production-level React application for a hackathon case.

🚨 RULES (VERY IMPORTANT)
Do NOT start coding immediately
Always follow this order strictly:
Architecture design
Folder structure
State management design
API layer design
Component breakdown
THEN code
Clean code, scalable architecture required
No Redux
No API calls inside components
axios ONLY for API
Context API allowed
🧩 CASE: DETECTIVE DASHBOARD

You are building a Detective Investigation Dashboard for a missing person called Qodo.

The system aggregates multiple fragmented datasets:

Check-ins
Messages
Sightings
Personal Notes
Anonymous Tips
🎯 GOAL

Transform all scattered data into a single unified timeline system that helps investigators:

Track Qodo’s movements
Correlate events by time/person
Identify last known location
Analyze messages and sightings together
🌐 API SOURCE

Jotform API:

https://api.jotform.com/form/{FORM_ID}/submissions?apiKey=KEY

FORM IDS:

Checkins: 261134527667966
Messages: 261133651963962
Sightings: 261133720555956
Notes: 261134449238963
Tips: 261134430330946

API key is stored in environment variables.

🧠 DATA MODEL (MANDATORY)

Normalize everything into:

{
id: string,
type: "checkin" | "message" | "sighting" | "note" | "tip",
person: string,
timestamp: string,
location?: string,
content: string
}

All datasets must be merged into ONE timeline.

🏗️ REQUIRED ARCHITECTURE

Use feature-based structure:

services/
hooks/
context/
components/
pages/
utils/
🧠 STATE MANAGEMENT
useState → local state
Context API → global state

Must include:

loading state
error state
selected event
filtered events
🌐 API LAYER RULES
axios only
centralized instance required
no fetch
no API calls in components
services layer mandatory
🧩 UI REQUIREMENTS

Layout:

Left: People list
Center: Timeline
Right: Detail panel
Top: Filters

Must include:

loading state
empty state
error state
✨ UX REQUIREMENTS
Timeline sorted by time
Click event → detail panel
Filters update instantly
Merge all data into single story
🎬 ANIMATIONS
scroll reveal (IntersectionObserver)
hover lift effect
stagger list animation
smooth transitions (opacity + transform only)
⚡ PERFORMANCE
memoization where needed
React.memo for heavy components
efficient list rendering
avoid unnecessary re-renders
📁 OUTPUT FORMAT

Respond in this exact order:

Architecture Plan
Folder Structure
State Design
API Layer Design
Component Tree
Code Implementation
UI/UX Explanation
Performance Notes
🎯 FINAL GOAL

A production-level investigative dashboard that merges fragmented data into a single coherent timeline to track a missing person.
