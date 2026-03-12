import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { serve } from 'inngest/express';
import connectDB from './config/db.js';

import webhookRoutes from './routes/webhook.routes.js';
import codeRoutes from './routes/code.routes.js';

import { inngest } from './jobs/inngest/client.js';
import { cleanupOrphanedInterviews } from './jobs/inngest/functions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string') {
  connectDB();
}

app.use(cors());


app.use('/api/webhooks', webhookRoutes);


app.use(express.json());

app.use('/api/code', codeRoutes);

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
