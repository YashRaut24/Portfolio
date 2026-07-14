# Portfolio Project Documentation

This document is a local-only reference for the portfolio project. It is meant to help other AI assistants understand the project quickly, preserve the current design intent, and avoid breaking the existing experience.

## 1. Project Purpose

This portfolio is a personal, visually rich website built to showcase:

- work and projects
- education and experience
- skills and achievements
- a contact form for inquiries

The overall experience is intentionally artistic, editorial, and immersive rather than purely minimal or corporate.

## 2. Project Structure

### Root Structure

- .gitignore: Git ignore rules for the repository
- Installations.txt: local setup or installation notes
- README.md: repository overview and project summary
- skills.md: local documentation for AI handoff and context
- backend/: server-side code for contact form handling
- frontend/: client-side React application
- Extras/: additional static or experimental UI files

### Frontend Structure

- frontend/my-app/index.html: Vite HTML entry point
- frontend/my-app/package.json: frontend dependencies and scripts
- frontend/my-app/vite.config.js: Vite configuration
- frontend/my-app/README.md: frontend-specific notes
- frontend/my-app/public/: static assets and public files
  - public/assets/fonts/: font files
  - public/assets/images/: image assets
  - public/favicon.svg
  - public/icons.svg
- frontend/my-app/src/App.jsx: main app composition
- frontend/my-app/src/App.css: app-level styles
- frontend/my-app/src/main.jsx: React entry point
- frontend/my-app/src/index.css: global base styles
- frontend/my-app/src/pages/
  - Home.jsx / Home.css
  - Explore.jsx / Explore.css
  - NotFound.jsx / NotFound.css
- frontend/my-app/src/components/
  - About/About.jsx, About.css
  - Achievements/Achievements.jsx, Achievements.css
  - Book/Book.jsx, Book.css, Cover.jsx, Cover.css, Page.jsx, Page.css, PageFlip.jsx, PageFlip.css, FloatingDoodles.css, floatingDoodles.jsx, InkBlots.css, InkBlots.jsx
  - CircularHub/CircularHub.jsx, CircularHub.css, ContentPanel.jsx, ContentPanel.css, Node.jsx, Node.css
  - Contact/Contact.jsx, Contact.css, ContactForm.jsx, ContactForm.css
  - Education/: currently empty folder for education section
  - Experience/Experience.jsx, Experience.css
  - Header/Header.jsx, Header.css
  - Projects/Projects.jsx, Projects.css, ProjectCard.jsx, ProjectCard.css, ProjectDetails.jsx
  - Skills/Skills.jsx, Skills.css
  - Stats/Stats.jsx, Stats.css, GithubActivity.jsx
  - ThemeToggle/ThemeToggle.jsx, ThemeToggle.css
  - common/: shared component folder
- frontend/my-app/src/context/
  - NavigationContext.jsx
  - ThemeContext.jsx
- frontend/my-app/src/data/
  - about.js
  - achievements.js
  - bookSpreads.js
  - education.js
  - experience.js
  - hubNodes.js
  - projects.js
  - skills.js
  - stats.js
- frontend/my-app/src/services/api.js: API service layer
- frontend/my-app/src/seo/SEO.jsx: SEO wrapper/component
- frontend/my-app/src/styles/
  - global.css
  - reset.css
  - variables.css
- frontend/my-app/src/assets/: local app assets

### Backend Structure

- backend/package.json: backend dependencies and scripts
- backend/src/app.js: backend app setup
- backend/src/server.js: server entry point
- backend/src/config/env.js: environment configuration
- backend/src/controllers/contact.controller.js: contact form controller
- backend/src/middlewares/
  - errorHandler.js
  - rateLimiter.js
  - validateRequest.js
- backend/src/models/: data models folder
- backend/src/routes/contact.routes.js: contact route definitions
- backend/src/services/email.service.js: email sending logic
- backend/src/utils/logger.js: logging utility

## 3. Core Technology Stack

- Frontend: React, Vite, CSS, JSX
- Backend: Node.js, Express
- Styling approach: component-level CSS and shared global styles
- Contact functionality: backend endpoint with rate limiting and validation

## 4. Design Philosophy

The portfolio should feel like a crafted storybook experience. The visual identity is built around:

- layered illustrations
- soft organic forms
- subtle texture and depth
- expressive but readable interfaces
- a balance between playfulness and professionalism

## 5. Current Visual Direction

Recent work focuses on the book-page aesthetic. The current style includes:

- decorative background treatment for book pages
- doodle-inspired shapes
- inkblot-style organic marks
- layered opacity and texture to create depth
- a handcrafted, artistic feel without overwhelming the content

### Design Guidelines

When editing visuals, preserve these principles:

- keep the design soft, organic, and slightly whimsical
- avoid harsh geometric excess
- maintain readability and hierarchy
- let decorative elements support the narrative, not overpower it
- prefer subtle refinements over drastic visual changes

## 6. Key UI Areas

### Book Experience

The book experience is one of the portfolio’s signature features. It is implemented through the book-related components under the frontend book component folder.

Important considerations:

- preserve the page-turning and storytelling mood
- keep decorative backgrounds subtle and layered
- ensure the page content remains legible

### Circular Hub / Navigation

The circular navigation system is a central interaction pattern. Changes here should preserve the overall flow and visual rhythm of the experience.

### Contact Section

The contact section should remain approachable and polished. Any changes should keep the form experience simple, clear, and reliable.

## 7. Content Organization

Portfolio content is mostly stored in data files under the frontend data directory. These files help keep components clean and make content updates easier.

Typical content sources include:

- about information
- achievements
- projects
- skills
- experience
- education
- stats

## 8. Development Notes

- The frontend is likely run from the frontend/my-app directory.
- Changes should ideally preserve existing structure and component naming patterns.
- New features should align with the current artistic visual language.
- Keep the site responsive and performant.

## 9. Handoff Guidance for Other AI Agents

When working on this project:

- respect the existing visual identity
- avoid large rewrites unless necessary
- preserve the artistic storytelling feel
- keep UI changes subtle and intentional
- maintain component consistency and responsiveness
- prefer content-driven updates where appropriate

## 10. Local-Only Documentation Note

This file is intentionally not intended for GitHub commit history. It is a private workspace reference for local AI collaboration and project context sharing.
