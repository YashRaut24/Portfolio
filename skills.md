# Portfolio Project Documentation

## Project Overview
This portfolio repository is a modular portfolio platform built with a React frontend and an Express backend. It is designed to demonstrate an interactive, non-scroll-based portfolio experience with a book-style UI and a technical page routing structure.

The project separates:
- Data layer: static content stored in frontend data files
- Presentation layer: React components for book pages, hub, pages, and routing
- Backend layer: Express API for contact form submission and messaging

## Key Features
- React + Vite frontend
- Interactive book-style portfolio navigation
- Circular hub / node navigation
- Contact form submit via backend API
- Theme support through React context
- Framer Motion animations for smooth visual transitions
- Separate `backend` and `frontend` applications in one mono-repo

## Technology Stack
- Frontend: React, Vite, React Router, Framer Motion, CSS
- Backend: Node.js, Express, helmet, cors, express-validator
- Email: Nodemailer via Gmail SMTP
- Dev tools: nodemon for backend development

## Backend
### Purpose
The backend hosts the contact API and handles email delivery for contact form submissions.

### Key backend files
- `backend/src/server.js`: starts the Express server
- `backend/src/app.js`: app setup with middleware and route registration
- `backend/src/routes/contact.routes.js`: defines the contact POST route with validation and rate limiting
- `backend/src/controllers/contact.controller.js`: controller for contact submission
- `backend/src/services/email.service.js`: sends contact emails using Nodemailer
- `backend/src/middlewares/validateRequest.js`: request validation logic
- `backend/src/middlewares/rateLimiter.js`: rate limiting for the contact endpoint
- `backend/src/middlewares/errorHandler.js`: centralized error handling
- `backend/src/config/env.js`: environment variable loader for backend configuration
- `backend/src/utils/logger.js`: logger helper

### Backend API
- `POST /api/contact`
  - Validates name, email, and message
  - Applies rate limiting
  - Sends an email to the configured contact address
  - Returns JSON with status and message

### Backend dependencies
- `express`
- `cors`
- `dotenv`
- `helmet`
- `express-validator`
- `express-rate-limit`
- `nodemailer`
- `nodemon` (dev)

## Frontend
### Purpose
The frontend renders the portfolio experience and includes pages for home, explore, and a not-found route.

### Key frontend files
- `frontend/my-app/src/main.jsx`: React entry point with theme provider setup
- `frontend/my-app/src/App.jsx`: defines router routes for `/`, `/explore`, and `*`
- `frontend/my-app/src/services/api.js`: frontend contact form API client
- `frontend/my-app/src/context/NavigationContext.jsx`: navigation state for portfolio pages
- `frontend/my-app/src/context/ThemeContext.jsx`: theme provider and dark/light theme state

### Core UI components
- `About` — user or portfolio description
- `Achievements` — achievement cards or timeline
- `Book` — book-style wrapper and page rendering
- `CircularHub` — interactive hub menu with orbiting nodes
- `Contact` — contact section and form
- `Experience` — experience timeline or cards
- `Header` — top navigation and brand header
- `Projects` — project listing and project details
- `Skills` — skills display component
- `Stats` — activity / statistic cards
- `ThemeToggle` — UI theme switcher
- `NotFound` — 404 fallback page

### Data files
- `frontend/my-app/src/data/about.js`
- `frontend/my-app/src/data/achievements.js`
- `frontend/my-app/src/data/bookSpreads.js`
- `frontend/my-app/src/data/education.js`
- `frontend/my-app/src/data/experience.js`
- `frontend/my-app/src/data/hubNodes.js`
- `frontend/my-app/src/data/projects.js`
- `frontend/my-app/src/data/skills.js`
- `frontend/my-app/src/data/stats.js`

### Frontend dependencies
- `react`
- `react-dom`
- `react-router-dom`
- `framer-motion`
- `@fontsource/comfortaa`
- `@fontsource/kalam`

### Frontend dev dependencies
- `vite`
- `eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `@eslint/js`
- `@vitejs/plugin-react`
- `@types/react`
- `@types/react-dom`

## Run Instructions
### Backend
1. `cd backend`
2. `npm install`
3. `npm run dev`

### Frontend
1. `cd frontend/my-app`
2. `npm install`
3. `npm run dev`

## Current Project Folder Structure
The following tree includes the current workspace files and project layout.

```
Portfolio/
├── .gitignore
├── Installations.txt
├── README.md
├── TODO.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── env.js
│       ├── controllers/
│       │   └── contact.controller.js
│       ├── middlewares/
│       │   ├── errorHandler.js
│       │   ├── rateLimiter.js
│       │   └── validateRequest.js
│       ├── routes/
│       │   └── contact.routes.js
│       ├── server.js
│       ├── services/
│       │   └── email.service.js
│       └── utils/
│           └── logger.js
├── Extras/
│   ├── Book.css
│   ├── Book.jsx
│   ├── Cover.css
│   ├── Cover.jsx
│   ├── Page.css
│   ├── Page.jsx
│   ├── PageFlip.css
│   └── PageFlip.jsx
└── frontend/
    └── my-app/
        ├── .gitignore
        ├── README.md
        ├── dist/
        │   ├── assets/
        │   │   ├── comfortaa-*.woff
        │   │   ├── comfortaa-*.woff2
        │   │   ├── kalam-*.woff
        │   │   ├── kalam-*.woff2
        │   │   ├── index-*.js
        │   │   ├── index-*.css
        │   │   └── other built assets
        │   ├── favicon.svg
        │   ├── icons.svg
        │   └── index.html
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── public/
        │   └── assets/
        │       ├── fonts/
        │       │   ├── SKETCHUP FREE TRIAL.woff
        │       │   └── SKETCHUP FREE TRIAL.woff2
        │       ├── sounds/
        │       │   ├── cover-open.mp3
        │       │   ├── hub-transition.mp3
        │       │   └── page-flip.mp3
        │       ├── favicon.svg
        │       └── icons.svg
        └── src/
            ├── App.css
            ├── App.jsx
            ├── assets/
            │   ├── hero.png
            │   ├── react.svg
            │   └── vite.svg
            ├── components/
            │   ├── About/
            │   │   ├── About.css
            │   │   └── About.jsx
            │   ├── Achievements/
            │   │   ├── Achievements.css
            │   │   └── Achievements.jsx
            │   ├── Book/
            │   │   ├── Book.css
            │   │   ├── Book.jsx
            │   │   ├── Cover.css
            │   │   ├── Cover.jsx
            │   │   ├── FloatingDoodles.css
            │   │   ├── floatingDoodles.jsx
            │   │   ├── Page.css
            │   │   ├── Page.jsx
            │   │   ├── PageFlip.css
            │   │   └── PageFlip.jsx
            │   ├── CircularHub/
            │   │   ├── CircularHub.css
            │   │   ├── CircularHub.jsx
            │   │   ├── ContentPanel.css
            │   │   ├── ContentPanel.jsx
            │   │   ├── HubDoodles.css
            │   │   ├── HubDoodles.jsx
            │   │   ├── Node.css
            │   │   ├── Node.jsx
            │   │   ├── OrbitRing.css
            │   │   └── OrbitRing.jsx
            │   ├── Contact/
            │   │   ├── Contact.css
            │   │   ├── Contact.jsx
            │   │   ├── ContactForm.css
            │   │   └── ContactForm.jsx
            │   ├── Experience/
            │   │   ├── Experience.css
            │   │   └── Experience.jsx
            │   ├── Header/
            │   │   ├── Header.css
            │   │   └── Header.jsx
            │   ├── NotFound/
            │   │   ├── NotFound.css
            │   │   └── NotFound.jsx
            │   ├── Projects/
            │   │   ├── ProjectCard.css
            │   │   ├── ProjectCard.jsx
            │   │   ├── ProjectDetails.jsx
            │   │   ├── Projects.css
            │   │   └── Projects.jsx
            │   ├── Skills/
            │   │   ├── Skills.css
            │   │   └── Skills.jsx
            │   ├── Stats/
            │   │   ├── GithubActivity.jsx
            │   │   ├── Stats.css
            │   │   └── Stats.jsx
            │   └── ThemeToggle/
            │       ├── ThemeToggle.css
            │       └── ThemeToggle.jsx
            ├── context/
            │   ├── NavigationContext.jsx
            │   └── ThemeContext.jsx
            ├── data/
            │   ├── about.js
            │   ├── achievements.js
            │   ├── bookSpreads.js
            │   ├── education.js
            │   ├── experience.js
            │   ├── hubNodes.js
            │   ├── projects.js
            │   ├── skills.js
            │   └── stats.js
            ├── index.css
            ├── main.jsx
            ├── pages/
            │   ├── Explore.css
            │   ├── Explore.jsx
            │   ├── Home.css
            │   └── Home.jsx
            ├── seo/
            │   └── SEO.jsx
            ├── services/
            │   └── api.js
            ├── styles/
            │   ├── global.css
            │   ├── reset.css
            │   └── variables.css
            └── utils/
                ├── motionPrefs.js
                └── sound.js
```

## Notes for AI or contributor context
- The project is organized as a mono-repo with separate backend and frontend apps.
- Frontend routing uses React Router with two main pages plus a 404 fallback.
- The interactive book is driven by page spread data and custom page components.
- The contact form calls the backend API at `http://localhost:5000/api/contact`.
- The backend uses `.env`-based config values for email credentials and allowed client origin.
- `Extras/` contains earlier or standalone book UI components that can be reused or referenced.

## Recommended next steps
- Add API endpoints for projects and experience if you want the portfolio data to become dynamic.
- Add a top-level README summary for deployment notes and environment variables.
- Keep `frontend/my-app/dist` as build output only; it can be regenerated with `npm run build`.
