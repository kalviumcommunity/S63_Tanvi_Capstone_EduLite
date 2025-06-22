const axios = require('axios');

async function testServer() {
  console.log('Testing server endpoints...\n');
  
  try {
    // Test main endpoint
    const mainResponse = await axios.get('http://localhost:5000/');
    console.log('✅ Main endpoint:', mainResponse.data);
    
    // Test Google OAuth endpoint (should return error since not configured)
    try {
      const googleResponse = await axios.get('http://localhost:5000/api/auth/google');
      console.log('❌ Google endpoint should have failed');
    } catch (error) {
      if (error.response?.status === 503) {
        console.log('✅ Google OAuth endpoint correctly returns 503 (not configured)');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error from Google endpoint:', error.message);
      }
    }
    
    // Test notifications endpoint (should work)
    try {
      const notificationsResponse = await axios.get('http://localhost:5000/api/notifications');
      console.log('❌ Notifications endpoint should require authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Notifications endpoint correctly requires authentication');
      } else {
        console.log('❌ Unexpected error from notifications endpoint:', error.message);
      }
    }
    
    console.log('\n🎉 Server is running successfully!');
    console.log('📝 To enable Google OAuth, set up your credentials following the guide in GOOGLE_OAUTH_SETUP.md');
    
  } catch (error) {
    console.log('❌ Server test failed:', error.message);
  }
}

testServer(); 