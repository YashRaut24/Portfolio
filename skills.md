# Portfolio Documentation

This file is a local workspace reference for the portfolio project. It captures the current implementation details, architecture, and editing guidance so future changes stay aligned with the existing experience.

## 1. Project Overview

This portfolio is a personal website for Yash built as a visually rich React experience with a strong narrative and editorial feel. The project is meant to showcase:

- AI engineering and full-stack development interests
- education and experience
- projects and achievements
- a contact channel for inquiries

The site currently blends two presentation styles:

- a book-style homepage experience with page-turning interactions
- an explore-style hub for navigating core sections

## 2. Core Product Goals

The portfolio is designed to feel more like an experience than a standard corporate website. The main goals are:

- present work in a memorable and artistic way
- keep content structured and easy to update
- support a polished contact flow
- preserve a handcrafted, story-driven visual identity

## 3. Current Implementation Summary

The project is currently implemented as a split-stack application:

- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Styling: component-level CSS and shared styles
- Animation: Framer Motion for book transitions
- Contact: Express endpoint that sends email through Nodemailer

## 4. High-Level Architecture

### Frontend

The frontend is built in the folder [frontend/my-app](frontend/my-app). It uses:

- React for UI rendering
- React Router for page navigation
- Vite as the development/build tool
- Framer Motion for animated page transitions
- local data modules for content

### Backend

The backend lives in [backend](backend). It currently focuses on the contact form and email delivery flow:

- route handling for contact requests
- validation and rate limiting middleware
- email service integration

### Data Flow

The current app flow is:

1. The home route renders the book experience.
2. The explore route renders a circular navigation experience.
3. The contact form calls the frontend API layer.
4. The backend receives the request, validates it, and sends an email.

## 5. Main Routes

The app currently uses the following routes:

- / -> home page with the interactive book
- /explore -> overview/navigation experience
- /\* -> fallback NotFound page

## 6. Frontend Structure

### Root Frontend Files

- [frontend/my-app/index.html](frontend/my-app/index.html): Vite entry HTML
- [frontend/my-app/package.json](frontend/my-app/package.json): scripts and dependencies
- [frontend/my-app/vite.config.js](frontend/my-app/vite.config.js): Vite configuration
- [frontend/my-app/src/App.jsx](frontend/my-app/src/App.jsx): route wiring
- [frontend/my-app/src/main.jsx](frontend/my-app/src/main.jsx): React mount point

### Pages

- [frontend/my-app/src/pages/Home.jsx](frontend/my-app/src/pages/Home.jsx): renders the book experience and page-level decorations
- [frontend/my-app/src/pages/Explore.jsx](frontend/my-app/src/pages/Explore.jsx): renders the explore hub experience with header and theme toggle
- [frontend/my-app/src/components/NotFound/NotFound.jsx](frontend/my-app/src/components/NotFound/NotFound.jsx): fallback route UI

### Core Components

- [frontend/my-app/src/components/Book/Book.jsx](frontend/my-app/src/components/Book/Book.jsx): orchestrates the page-turning book experience
- [frontend/my-app/src/components/Book/PageFlip.jsx](frontend/my-app/src/components/Book/PageFlip.jsx): handles page flip animation logic
- [frontend/my-app/src/components/Book/Cover.jsx](frontend/my-app/src/components/Book/Cover.jsx): cover UI for the book opening state
- [frontend/my-app/src/components/CircularHub/CircularHub.jsx](frontend/my-app/src/components/CircularHub/CircularHub.jsx): interactive hub-based navigation
- [frontend/my-app/src/components/Contact/Contact.jsx](frontend/my-app/src/components/Contact/Contact.jsx): contact section UI
- [frontend/my-app/src/components/Contact/ContactForm.jsx](frontend/my-app/src/components/Contact/ContactForm.jsx): form submission UI
- [frontend/my-app/src/components/Header/Header.jsx](frontend/my-app/src/components/Header/Header.jsx): top-level navigation header
- [frontend/my-app/src/components/ThemeToggle/ThemeToggle.jsx](frontend/my-app/src/components/ThemeToggle/ThemeToggle.jsx): theme switcher UI
- [frontend/my-app/src/components/Projects/Projects.jsx](frontend/my-app/src/components/Projects/Projects.jsx): project showcase section
- [frontend/my-app/src/components/Skills/Skills.jsx](frontend/my-app/src/components/Skills/Skills.jsx): skills display section
- [frontend/my-app/src/components/Stats/Stats.jsx](frontend/my-app/src/components/Stats/Stats.jsx): metrics/summary UI
- [frontend/my-app/src/components/Experience/Experience.jsx](frontend/my-app/src/components/Experience/Experience.jsx): experience timeline display
- [frontend/my-app/src/components/Achievements/Achievements.jsx](frontend/my-app/src/components/Achievements/Achievements.jsx): achievements section

### Shared Content and Data Files

Content is mostly centralized in the data folder:

- [frontend/my-app/src/data/about.js](frontend/my-app/src/data/about.js)
- [frontend/my-app/src/data/achievements.js](frontend/my-app/src/data/achievements.js)
- [frontend/my-app/src/data/bookSpreads.js](frontend/my-app/src/data/bookSpreads.js)
- [frontend/my-app/src/data/education.js](frontend/my-app/src/data/education.js)
- [frontend/my-app/src/data/experience.js](frontend/my-app/src/data/experience.js)
- [frontend/my-app/src/data/hubNodes.js](frontend/my-app/src/data/hubNodes.js)
- [frontend/my-app/src/data/projects.js](frontend/my-app/src/data/projects.js)
- [frontend/my-app/src/data/skills.js](frontend/my-app/src/data/skills.js)
- [frontend/my-app/src/data/stats.js](frontend/my-app/src/data/stats.js)

These files should be the first place to update when changing copy or content.

## 7. Book Experience Notes

The homepage experience is built around the book system in [frontend/my-app/src/components/Book](frontend/my-app/src/components/Book). The main interaction pattern is:

- the cover opens into a spread-based book experience
- each spread is defined in [frontend/my-app/src/data/bookSpreads.js](frontend/my-app/src/data/bookSpreads.js)
- navigation uses next/previous actions and animated transitions
- the experience is intended to feel tactile, story-driven, and immersive

Important editing guidance:

- preserve the page-turning mood
- keep decorative elements subtle and supporting
- maintain legibility of text and headings
- avoid replacing the book feel with a conventional card layout

## 8. Explore Experience Notes

The explore route uses the circular hub system in [frontend/my-app/src/components/CircularHub](frontend/my-app/src/components/CircularHub). It is intended as a more direct navigation experience for browsing portfolio sections.

When changing this area:

- preserve the overall rhythm and clarity of the hub
- keep interactions intuitive
- make sure it remains visually consistent with the rest of the portfolio

## 9. Contact Flow

The contact system is currently wired through the frontend API service and backend endpoint.

### Frontend API

The frontend service in [frontend/my-app/src/services/api.js](frontend/my-app/src/services/api.js) posts form data to the backend contact route.

### Backend Route

The route is defined in [backend/src/routes/contact.routes.js](backend/src/routes/contact.routes.js) and is protected by:

- validation rules
- rate limiting
- a controller handler

### Email Delivery

The actual email sending logic is in [backend/src/services/email.service.js](backend/src/services/email.service.js). It uses Nodemailer with Gmail credentials from environment variables.

## 10. Environment Configuration

The backend reads configuration from [backend/src/config/env.js](backend/src/config/env.js). The expected variables are:

- PORT: server port, defaults to 5000
- EMAIL_USER: Gmail account username
- EMAIL_PASS: Gmail app password or SMTP password
- CLIENT_URL: frontend origin, defaults to http://localhost:5173

These values should be placed in a local environment file for the backend.

## 11. Development Workflow

### Frontend

From the project root:

- cd frontend/my-app
- npm install
- npm run dev

This starts the Vite development server.

### Backend

From the project root:

- cd backend
- npm install
- npm run dev

This starts the Express server with nodemon.

## 12. Styling and Visual Direction

The portfolio’s visual language is intentionally more artistic than purely minimal. The current design principles are:

- soft and layered visuals
- organic shapes and textures
- editorial composition
- readable content hierarchy
- subtle decorative detail rather than clutter

When editing styles:

- keep the experience cohesive and polished
- preserve the storytelling tone
- avoid making the design too stark or corporate
- prefer small refinements over large visual resets

## 13. Content Management Guidance

Most content is stored as data arrays/objects rather than being hard-coded directly into components. This is the preferred pattern for updates.

Recommended workflow:

- update copy in the relevant data file
- keep components focused on structure and rendering
- avoid hard-coding new copy directly into JSX unless the section is unique

## 14. Current Status and Notes

The project is in a partially built state. Some sections are present structurally but may still contain placeholders or incomplete content.

Current observations:

- the book experience is the main showcase experience
- the explore experience is present and functional at a structural level
- the contact pathway is wired but depends on valid email credentials
- project data is still placeholder content and should be replaced with real projects over time

## 15. Safe Editing Guidelines

When making changes:

- preserve the route structure unless a new route is intentionally introduced
- keep the visual language consistent with the current portfolio identity
- update data files before modifying component logic whenever possible
- respect the existing component organization and naming conventions
- avoid unnecessary rewrites of the book experience unless the change is intentional and well-scoped

## 16. Local-Only Note

This document is intended for local AI handoff and workspace continuity. It should remain a practical reference for preserving the current design intent and implementation structure.
