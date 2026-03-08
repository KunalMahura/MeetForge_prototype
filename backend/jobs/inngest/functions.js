import { inngest } from './client.js';
import Interview from '../../models/Interview.js';

// Automatically clean up sessions after 2 hours if users forget to end them
export const cleanupOrphanedInterviews = inngest.createFunction(
  { id: 'cleanup-orphaned-interviews' },
  { event: 'interview.started' },
  async ({ event, step }) => {
    const { interviewId } = event.data;

    // Sleep for 2 hours
    await step.sleep('wait-for-session-end', '2h');

    // Run a step to mark the interview as completed if it is still "in-progress"
    await step.run('close-interview', async () => {
      const interview = await Interview.findById(interviewId);
      
      if (interview && interview.status === 'in-progress') {
        interview.status = 'completed';
        await interview.save();
        return { message: `Interview ${interviewId} automatically closed.` };
      }
      return { message: `Interview ${interviewId} was already closed or not in-progress.` };
    });
  }
);
