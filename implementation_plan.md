# Implementation Plan: MeetForge - Phase 2 (Core Features)

This plan outlines the next steps to move MeetForge from a boilerplate to a functional 1-on-1 interview platform.

## Current Status
- ✅ Project Scaffold (MERN)
- ✅ Clerk Authentication & User Sync
- ✅ Local Code Execution Engine (Node, Python, Java)
- ✅ Responsive UI with Custom Theme

## [NEW] Proposed Changes

### [Backend] Interview Management & Integration
We need to provide the logic for creating and managing interview sessions.

#### [NEW] [interview.routes.js](file:///c:/Users/kunal/Desktop/antigravity_projects/meetForge/backend/routes/interview.routes.js)
- Define routes for `POST /` (Create), `GET /` (List user's interviews), `GET /:roomId` (Get details).

#### [NEW] [interview.controller.js](file:///c:/Users/kunal/Desktop/antigravity_projects/meetForge/backend/controllers/interview.controller.js)
- **createInterview**: Save new interview to MongoDB with `roomId`.
- **getUserInterviews**: Fetch interviews where the user is a participant.
- **getStreamToken**: Generate an authentication token for the Stream Video SDK.

---

### [Frontend] Dashboard & Real-time Room
The UI needs to transition from static placeholders to dynamic, data-driven components.

#### [MODIFY] [Dashboard.jsx](file:///c:/Users/kunal/Desktop/antigravity_projects/meetForge/frontend/src/pages/Dashboard.jsx)
- Fetch the list of upcoming and past interviews from the backend using `useEffect`.
- Update `handleCreateRoom` to call the backend API before navigating.

#### [MODIFY] [InterviewRoom.jsx](file:///c:/Users/kunal/Desktop/antigravity_projects/meetForge/frontend/src/pages/InterviewRoom.jsx)
- Integrate `@stream-io/video-react-sdk` for live video and audio.
- Integrate Stream Chat components.
- **Real-time Sync**: Implement synchronization for the Monaco Editor state (potentially using Stream's custom room state or a lightweight socket implementation).

## Verification Plan

### Automated Tests
- No automated tests currently exist. I will add basic unit tests for the code execution logic if needed.
- `npm test` will be configured to run Jest/Vitest.

### Manual Verification
1. **Interview Lifecycle**: Create an interview on the Dashboard -> Verify it appears in "Upcoming Sessions" -> Join the room.
2. **Video/Audio**: Open the same Room ID in two different browser windows (logged in as different users) -> Verify video/audio connection via Stream.
3. **Code Sync**: Type in the editor in Window A -> Verify it updates in Window B.
4. **Code Execution**: Run a Python script -> Verify output is consistent for both participants.
