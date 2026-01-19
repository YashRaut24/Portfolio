Portfolio System – MERN Stack

A modular portfolio platform built using the MERN stack, designed to support multiple presentation modes while sharing the same data and backend logic.

The project demonstrates how portfolio content can be rendered through different UI systems (e.g., interactive book-style, technical layout) without duplicating data or business logic.

🚀 Core Idea

Instead of a single static portfolio layout, this system separates:

Data layer (projects, experience, contact, messages)

Logic layer (state, navigation, API communication)

Presentation layer (Book-style UI, Technical UI)

This allows users to switch how content is experienced while keeping the backend consistent and scalable.

🧱 Supported Portfolio Modes
📖 Book Mode

Portfolio behaves like a physical book

No vertical scrolling

Navigation via horizontal page flips

Smooth page-turn animations

Each section represents a book page

Fixed book aspect ratio

Mobile support with touch-based page flipping

🧑‍💻 Technical Mode (Planned)

Traditional structured layout

Section-based navigation

Same data source as Book Mode

Designed for quick scanning and technical review

🛠 Tech Stack
Frontend

React (Vite)

CSS Modules / Scoped CSS

Framer Motion (page flip animations)

State-based navigation (no scroll-based routing)

Backend

Node.js

Express.js

MongoDB

Mongoose

📐 Architecture Overview
Frontend (React)
 ├── Shared Data Fetching Layer
 ├── Mode Selector (Book / Technical)
 ├── Book Container
 │    ├── Page Components
 │    └── Page Flip Logic
 └── Technical Layout (future)

Backend (Express + MongoDB)
 ├── Projects API
 ├── Experience API
 ├── Contact API
 └── Messages / Interactions


All modes consume the same REST APIs

UI modes are decoupled from data

Easy to extend with new presentation styles

📂 Folder Structure
/frontend
 ├── components
 │    ├── Book
 │    ├── Pages
 │    ├── UI
 │    └── ModeSelector
 ├── services (API calls)
 ├── styles
 └── main.jsx

/backend
 ├── models
 ├── routes
 ├── controllers
 ├── config
 └── server.js

🔄 Navigation Logic

Portfolio does not scroll

Current page index is tracked in state

Page transitions handled using Framer Motion

Navigation only through:

Page flipping

Explicit controls (back / start / mode switch)

📡 Backend APIs

GET /api/projects – fetch project data

GET /api/experience – fetch experience timeline

POST /api/contact – submit contact form

POST /api/messages – visitor messages

📱 Responsiveness

Fixed aspect ratio maintained

Book rotates vertically on mobile

Page flipping supported via touch gestures

UI remains smooth across devices

🎯 Project Goals

Demonstrate advanced frontend architecture

Show separation of UI and data layers

Implement non-scroll-based navigation

Build a scalable portfolio system, not a static site

🧪 Status

✅ Book Mode: In progress

⏳ Technical Mode: Planned

⏳ Additional modes: Extensible
