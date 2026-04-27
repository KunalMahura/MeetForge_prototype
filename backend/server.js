import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { serve } from 'inngest/express';
import connectDB from './config/db.js';

// Routes
import webhookRoutes from './routes/webhook.routes.js';
import codeRoutes from './routes/code.routes.js';
import interviewRoutes from './routes/interview.routes.js';

// Inngest
import { inngest } from './jobs/inngest/client.js';
import { cleanupOrphanedInterviews } from './jobs/inngest/functions.js';

import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, replace with actual frontend URL
    methods: ['GET', 'POST']
  }
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('A user connected via Socket.io:', socket.id);

  // Join a specific interview room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle code changes from Monaco editor
  socket.on('code-change', ({ roomId, code }) => {
    // Broadcast code to everyone else in the room
    socket.to(roomId).emit('receive-code-change', code);
  });

  // Handle code execution output
  socket.on('code-output', ({ roomId, output }) => {
    socket.to(roomId).emit('receive-code-output', output);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// Only connect if URI is real, allowing server to start minimally for boilerplate
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string') {
  connectDB();
}

// Middleware
app.use(cors());

// Webhook route needs raw body for signature verification
// so we mount it BEFORE the global express.json()
app.use('/api/webhooks', webhookRoutes);

// Global JSON middleware for normal requests
app.use(express.json());

// Main API Routes
app.use('/api/code', codeRoutes);
app.use('/api/interviews', interviewRoutes);

// Inngest route for background jobs integration
app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions: [cleanupOrphanedInterviews],
  })
);

app.get('/', (req, res) => {
  res.send('MeetForge API is running...');
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
