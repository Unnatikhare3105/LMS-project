# Architecture: AI-Powered LMS

## 1. Overview
This project follows a modern full-stack architecture with a separate frontend and backend. The frontend provides the user experience, while the backend handles authentication, AI integrations, content generation, persistence, and business logic.

## 2. High-Level Architecture
The system is organized into the following layers:
- Frontend Layer: Next.js client app with React components and state management
- API Layer: Express routes and middleware
- Service Layer: Business logic, AI orchestration, and domain operations
- Data Layer: MongoDB, Redis, and file-based runtime configuration

## 3. Application Flow
1. User opens the app and signs in or registers.
2. The frontend sends requests to the backend through REST APIs.
3. The backend validates the request and uses services for processing.
4. AI services generate or enrich learning content.
5. Results are stored in MongoDB and returned to the client.
6. User actions such as bookmarking, quiz submission, or challenge updates are reflected in the UI.

## 4. Technical Stack
### Frontend
- Next.js
- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Axios
- Lucide icons
- React Hot Toast

### Backend
- Node.js
- Express.js
- TypeScript
- Mongoose
- JWT + bcrypt
- Redis
- Socket.io
- Google GenAI / OpenAI-style AI integration

## 5. Project Structure
### Root
- package.json: scripts for running frontend and backend together
- Backend/: server-side code
- client/: frontend code

### Backend Structure
- src/app.ts: main application bootstrap
- src/server.ts: server startup
- src/controllers/: request handlers
- src/services/: business logic and AI integration
- src/repositories/: database access layer
- src/models/: MongoDB schemas
- src/routers/: API route definitions
- src/middlewares/: auth, error handling, request validation flow
- src/utils/: helpers and utilities
- src/db/: database connection
- src/config/: environment and configuration

### Frontend Structure
- app/: route-based pages
- src/components/: reusable UI components
- src/services/: API wrappers
- src/store/: Redux state and slices
- src/hooks/: typed Redux hooks
- src/types/: shared TypeScript types
- src/validations/: form and input validation

## 6. Data Flow
### User Authentication Flow
- Client submits credentials
- Backend validates them
- JWT is created and sent via cookie or response
- Protected routes check the token with auth middleware

### Syllabus Generation Flow
- User enters a topic
- Backend calls the AI service
- AI returns structured content or video references
- Content is saved and returned to the client

### Quiz Flow
- User requests quiz questions for a topic
- Backend generates quiz content
- Answers are submitted and validated by the backend

## 7. Infrastructure and Services
- MongoDB for persistent user and content data
- Redis for caching and fast lookups
- Socket.io for real-time updates if needed in leaderboard or activity features
- AI services for content generation and quiz creation

## 8. Design Principles
- Keep business logic in services
- Separate controllers from database logic
- Use typed interfaces and shared models
- Centralize error handling
- Protect sensitive routes with authentication middleware
- Prefer reusable components on the frontend
