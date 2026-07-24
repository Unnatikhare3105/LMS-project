# AI Development Rules

## 1. General Rules
- Follow the existing project structure and conventions.
- Prefer TypeScript and keep code strongly typed.
- Use existing patterns in the backend and frontend before introducing new ones.
- Keep implementations simple, readable, and maintainable.

## 2. Backend Rules
- Keep business logic in services, not directly in controllers.
- Use repositories for database access.
- Use middleware for authentication and error handling.
- Validate user input before processing it.
- Use custom error handling instead of throwing unstructured errors.
- Do not expose secrets in code or logs.

## 3. Frontend Rules
- Use functional React components and hooks.
- Keep UI state predictable with Redux Toolkit where appropriate.
- Reuse components instead of duplicating code.
- Avoid unnecessary client-side complexity for simple flows.
- Use loading and error states for async operations.

## 4. AI Rules
- Do not hallucinate missing facts or pretend the AI produced content without validation.
- Always validate AI-generated output before returning it to the client.
- Handle AI failures gracefully with fallback messages.
- Avoid exposing raw AI errors directly to the user unless needed.
- Keep prompts structured and safe.

## 5. Library and Dependency Rules
- Prefer already-installed libraries over adding new dependencies.
- Use established tools like Next.js, React, Redux Toolkit, Express, Mongoose, and Tailwind.
- Avoid unnecessary heavy libraries unless clearly justified.
- Keep dependencies compatible with the existing stack.

## 6. Error Handling Rules
- Catch errors at the service or controller boundary.
- Return clear and consistent API responses.
- Avoid silent failures.
- Log important failures for debugging.

## 7. Security Rules
- Never trust client-side input.
- Protect private routes with authentication middleware.
- Use secure password hashing and JWT-based auth patterns.
- Prevent common injection and misuse issues.

## 8. What AI Should Do
- Build features in small, testable steps
- Keep the project aligned with the documented architecture
- Improve code quality and maintain consistency
- Document important implementation decisions

## 9. What AI Should Not Do
- Do not break existing working flows while adding new features
- Do not ignore existing folder conventions
- Do not hardcode secrets or environment values
- Do not make large architectural changes without justification
