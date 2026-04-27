import crypto from 'crypto';
import { StreamChat } from 'stream-chat';
import Interview from '../models/Interview.js';
import User from '../models/User.js';

// CREATE A NEW INTERVIEW
export const createInterview = async (req, res) => {
  try {
    // For now, we mock the user ID since auth middleware isn't set up yet on this route.
    // In production with Clerk, you would extract req.auth.userId
    const { userId } = req.body; 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the user in our DB (Created by Clerk Webhook)
    let user = await User.findOne({ clerkId: userId });
    
    // Fallback: If webhook failed or hasn't fired yet, create user on the fly
    if (!user) {
      if (!req.body.email || !req.body.username) {
        return res.status(404).json({ error: 'User not found in database and insufficient data provided to create one.' });
      }
      user = new User({
        clerkId: userId,
        email: req.body.email,
        username: req.body.username,
        imageUrl: req.body.imageUrl || '',
      });
      await user.save();
    }

    // Generate a unique room ID
    const roomId = crypto.randomBytes(4).toString('hex');

    const newInterview = new Interview({
      roomId,
      participants: [user._id],
      status: 'scheduled',
      scheduledAt: new Date(),
    });

    await newInterview.save();
    
    res.status(201).json({ 
      success: true, 
      roomId: newInterview.roomId,
      interview: newInterview
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET USER'S INTERVIEWS
export const getUserInterviews = async (req, res) => {
  try {
    const { userId } = req.query; // Usually from req.auth.userId
    
    if (!userId) {
       return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all interviews where this user is a participant
    const interviews = await Interview.find({ participants: user._id })
      .populate('participants', 'username email imageUrl') // Fetch details of participants
      .sort({ createdAt: -1 });

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
    const { userId } = req.body; // Usually from req.auth.userId

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required to join' });
    }

    let user = await User.findOne({ clerkId: userId });
    
    // Fallback: If webhook failed or hasn't fired yet, create user on the fly
    if (!user) {
      if (!req.body.email || !req.body.username) {
        return res.status(404).json({ error: 'User not found in database and insufficient data provided to create one.' });
      }
      user = new User({
        clerkId: userId,
        email: req.body.email,
        username: req.body.username,
        imageUrl: req.body.imageUrl || '',
      });
      await user.save();
    }

    const interview = await Interview.findOne({ roomId });
    if (!interview) {
      return res.status(404).json({ error: 'Interview room not found' });
    }

    // Check if user is already a participant
    const isParticipant = interview.participants.includes(user._id);

    // Access Control Logic
    if (!isParticipant) {
      if (interview.participants.length >= 2) {
        return res.status(403).json({ error: 'Room is locked. This is a 1-on-1 interview and is already full.' });
      }
      
      // Add the user to the room
      interview.participants.push(user._id);
      if (interview.participants.length === 2) {
        interview.status = 'in-progress';
      }
      await interview.save();
    }

    const updatedInterview = await Interview.findOne({ roomId })
      .populate('participants', 'username email imageUrl clerkId');

    res.status(200).json({ success: true, interview: updatedInterview });
  } catch (error) {
    console.error('Error joining interview:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET STREAM TOKEN
export const getStreamToken = async (req, res) => {
  try {
    const { userId } = req.query; // Usually req.auth.userId

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

    // Generate token valid for 1 hour
    const token = serverClient.createToken(userId);

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};
