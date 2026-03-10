# MeetForge - 1-on-1 Interview Platform

This project is a MERN-stack application leveraging Clerk for Auth, Stream for Video/Chat, Monaco Editor for code rendering, and Inngest for background jobs.

## Folder Structure

- `/backend`: The Express server and APIs
  - `/config`: Database configuration.
  - `/controllers`: Logic for the Clerk Webhook and Piston code execution.
  - `/jobs`: Inngest background jobs for session cleanup.
  - `/models`: Mongoose schemas for Users and Interviews.
  - `/routes`: API endpoints.
- `/frontend`: The React application
  - `/src/pages`: 
    - `Dashboard.jsx`: Displays past and upcoming sessions.
    - `InterviewRoom.jsx`: The 1-on-1 technical interview room.

## Setup Instructions

### 1. Prerequisites
Make sure you have Node.js and npm installed.

**Code Execution Prerequisites (Important for Team):** 
Because this project uses *Local Code Execution* (running code directly on the backend server instead of via a paid 3rd-party API), any language you want to execute in the Interview Room must be installed on the machine running the backend server.
- **JavaScript**: Works automatically (runs via Node.js).
- **Python**: You must have Python installed and in your system PATH.
- **Java**: You must have the Java Development Kit (JDK 11+) installed.

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename `.env.example` to `.env` and add your keys (MongoDB, Clerk Webhook Secret, Inngest).
4. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename `.env.local` to `.env.local` inside `frontend` and add your keys (Clerk Publishable Key, Stream API Key).
4. Run the Vite development server:
   ```bash
   npm run dev
   ```

### Getting Your API Keys
- **Clerk**: [clerk.com](https://clerk.com/)
- **Stream**: [getstream.io](https://getstream.io/)
- **MongoDB**: [mongodb.com/atlas](https://www.mongodb.com/atlas)
- **Inngest**: [inngest.com](https://www.inngest.com/)
