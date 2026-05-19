import { Webhook } from 'svix';
import prisma from '../config/prisma.js';

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook secret missing' });
  }

  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occurred -- no svix headers' });
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Error verifying webhook' });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { email_addresses, username, image_url, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = username || `${first_name || ''} ${last_name || ''}`.trim();

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          username: name,
          imageUrl: image_url,
        },
        create: {
          clerkId: id,
          email,
          username: name,
          imageUrl: image_url,
        },
      });
      console.log(`User ${id} synced to database`);
    } catch (dbError) {
      console.error('Error updating DB from webhook:', dbError);
      return res.status(500).json({ error: 'Database error' });
    }
  } else if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({ where: { clerkId: id } });
    } catch (dbError) {
      // User may not exist — not a critical error
      console.error('Error deleting user from DB:', dbError);
    }
  }

  return res.status(200).json({ success: true });
};
