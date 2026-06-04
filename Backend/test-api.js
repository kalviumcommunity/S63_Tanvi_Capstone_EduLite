const http = require('http');

const req = http.request('http://localhost:5001/api/activity-logs', {
  method: 'GET',
  headers: {
    // try to bypass auth or see if it fails at auth
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
req.on('error', console.error);
req.end();
