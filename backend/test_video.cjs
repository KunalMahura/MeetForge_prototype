const { StreamVideoClient } = require('@stream-io/video-react-sdk');
const { StreamChat } = require('stream-chat');

const apiKey = 'cch7a2j84q2t';
const apiSecret = 'dwsr5p374qekv7m9mpdftm4h4hh4hqmtkcx9ty2wgbtebezuxsdxf42sumztvf2s';

async function testVideo() {
  try {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    const token = serverClient.createToken('test_user_123');
    
    console.log("Initializing StreamVideoClient...");
    const vClient = new StreamVideoClient({ apiKey, user: { id: 'test_user_123' }, token });
    
    console.log("Creating call...");
    const myCall = vClient.call('default', 'test_room_123');
    
    console.log("Joining call...");
    await myCall.join({ create: true });
    
    console.log("Joined video call successfully!");
    await vClient.disconnectUser();
  } catch (err) {
    console.error("Video test failed:", err);
  }
}
testVideo();
