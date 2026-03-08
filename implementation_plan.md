# Implementation Plan: MeetForge Boilerplate

This plan details the creation of the boilerplate code for the MERN stack 1-on-1 interview platform "MeetForge".

## Proposed Changes

We will scaffold the project in the workspace with `frontend` and `backend` directories.

### Backend Structure
- `backend/server.js`: Entry point.
- `backend/models/User.js`: Mongoose model for users (synced from Clerk).
- `backend/models/Interview.js`: Mongoose model for interviews.
- `backend/controllers/webhook.controller.js`: Clerk Webhook handler to sync user creation/updates to MongoDB.
- `backend/controllers/code.controller.js`: Piston API integration to execute code.
- `backend/jobs/inngest/client.js` & `backend/jobs/inngest/functions.js`: Inngest setup for interview session cleanup.
- `backend/routes/...`: Express routes mapping to controllers.

### Frontend Structure
- `frontend/src/App.jsx`: Main routing.
- `frontend/src/pages/Dashboard.jsx`: Displays "Past Interviews" and "Upcoming Sessions".
- `frontend/src/pages/InterviewRoom.jsx`: The 1-on-1 room logic (Monaco Editor, Stream Video SDK, locking mechanism).

## Verification Plan
We will review the generated code to ensure:
- The Clerk Webhook handles standard events (`user.created`, `user.updated`).
- The Piston API handler properly formulates requests to `Execute Code`.
- The Inngest logic is structured correctly for background jobs.
- The React components reflect the requested libraries (Tailwind, Monaco, Stream).
