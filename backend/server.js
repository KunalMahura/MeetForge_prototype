import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { serve } from 'inngest/express';
import connectDB from './config/db.js';

// Routes
import webhookRoutes from './routes/webhook.routes.js';
import codeRoutes from './routes/code.routes.js';

// Inngest
import { inngest } from './jobs/inngest/client.js';
import { cleanupOrphanedInterviews } from './jobs/inngest/functions.js';

dotenv.config();

const app = express();
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
