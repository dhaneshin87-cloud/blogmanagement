import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

const testPost = {
  title: "Test Post",
  content: "This is a test post content"
};

const testToken = "YOUR_VALID_JWT_TOKEN_HERE";

async function testPostCreate() {
  
  try {
    
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE}/blog/post/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      },
      body: JSON.stringify(testPost)
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    
    if (response.ok) {
      const data = await response.json();
    } else {
      const errorData = await response.text();
    }
    
  } catch (error) {
    
  }
}


if (testToken === "YOUR_VALID_JWT_TOKEN_HERE") {
} else {
  testPostCreate();
}
