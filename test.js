fetch('http://localhost:5000/api/interviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test_user_123',
    email: 'test@example.com',
    username: 'TestUser'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
