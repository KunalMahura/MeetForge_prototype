const { StreamChat } = require('stream-chat');
const apiKey = 'cch7a2j84q2t';
const apiSecret = 'dwsr5p374qekv7m9mpdftm4h4hh4hqmtkcx9ty2wgbtebezuxsdxf42sumztvf2s';

async function test() {
  try {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    const token = serverClient.createToken('test_user_123');
    console.log("Token generated:", token);
    
    // Now try to connect as this user
    const client = StreamChat.getInstance(apiKey);
    await client.connectUser({ id: 'test_user_123', name: 'Test User' }, token);
    console.log("Connected successfully!");
    await client.disconnectUser();
  } catch (err) {
    console.error("Stream test failed:", err.message);
  }
}
test();
