# Project Memory

## Current Project Summary
This workspace contains an AI-powered LMS project built with:
- Frontend: Next.js, React, TypeScript, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Redis, Socket.io
- Core features: authentication, topic-based learning content generation, quizzes, bookmarks, daily challenges, and progress tracking

## Important Project Facts
- The app is split into a client/ frontend and Backend/ server.
- The root package.json runs both services together.
- The backend uses a service-repository-controller pattern.
- The frontend uses route-based pages under client/app and reusable components under client/src/components.

## Current Implementation Status
- Authentication and core app structure are present.
- AI-powered syllabus, quiz, bookmark, and daily challenge modules are being developed or integrated.
- Future work should preserve the existing architecture and patterns.

## Working Notes for Future AI Sessions
- Prefer incremental changes over large rewrites.
- Keep compatibility with the current folder structure.
- Preserve existing routes, services, and naming conventions.
- Validate new features against the current backend/frontend patterns.
- When adding new features, update this file with progress so future agents retain context.
