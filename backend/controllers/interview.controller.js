import crypto from 'crypto';
import { StreamChat } from 'stream-chat';
import prisma from '../config/prisma.js';

// Helper: find or create a user from Clerk data
async function findOrCreateUser(userId, body) {
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    if (!body.email || !body.username) {
      return null;
    }
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: body.email,
        username: body.username,
        imageUrl: body.imageUrl || null,
      },
    });
  }

  return user;
}

// CREATE A NEW INTERVIEW
export const createInterview = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await findOrCreateUser(userId, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found and insufficient data to create one.' });
    }

    const roomId = crypto.randomBytes(4).toString('hex');

    const newInterview = await prisma.interview.create({
      data: {
        roomId,
        status: 'scheduled',
        scheduledAt: new Date(),
        participants: {
          connect: { clerkId: userId },
        },
      },
      include: {
        participants: {
          select: { clerkId: true, username: true, email: true, imageUrl: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      roomId: newInterview.roomId,
      interview: newInterview,
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET USER'S INTERVIEWS
export const getUserInterviews = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const interviews = await prisma.interview.findMany({
      where: {
        participants: {
          some: { clerkId: userId },
        },
      },
      include: {
        participants: {
          select: { clerkId: true, username: true, email: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, interviews });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET DETAILS & JOIN INTERVIEW (ACCESS CONTROL)
export const joinInterview = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required to join' });
    }

    const user = await findOrCreateUser(userId, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found and insufficient data to create one.' });
    }

    const interview = await prisma.interview.findUnique({
      where: { roomId },
      include: { participants: true },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview room not found' });
    }

    const isParticipant = interview.participants.some(p => p.clerkId === userId);

    if (!isParticipant) {
      if (interview.participants.length >= 2) {
        return res.status(403).json({ error: 'Room is locked. This is a 1-on-1 interview and is already full.' });
      }

      const newParticipantCount = interview.participants.length + 1;
      await prisma.interview.update({
        where: { roomId },
        data: {
          participants: { connect: { clerkId: userId } },
          status: newParticipantCount === 2 ? 'in_progress' : 'scheduled',
        },
      });
    }

    const updatedInterview = await prisma.interview.findUnique({
      where: { roomId },
      include: {
        participants: {
          select: { clerkId: true, username: true, email: true, imageUrl: true },
        },
      },
    });

    res.status(200).json({ success: true, interview: updatedInterview });
  } catch (error) {
    console.error('Error joining interview:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET STREAM TOKEN
export const getStreamToken = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required for token' });
    }

    const STREAM_API_KEY = process.env.STREAM_API_KEY;
    const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      console.error('Stream API keys are missing in backend environment');
      return res.status(500).json({ error: 'Stream configuration missing on server' });
    }

    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    const token = serverClient.createToken(userId);

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};
