const https = require('https');
const http = require('http');

// Test URLs
const testUrls = [
  'http://localhost:3000/admin',
  'http://localhost:3000/admin/dashboard',
  'http://localhost:3000/admin/products',
  'http://localhost:3000/admin/orders',
  'http://localhost:3000/admin/customers',
  'http://localhost:3000/admin/analytics'
];

// Function to test a URL
function testUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isRedirect = res.statusCode >= 300 && res.statusCode < 400;
        const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
        
        resolve({
          url,
          status: res.statusCode,
          success: isSuccess,
          redirect: isRedirect ? res.headers.location : null,
          contentLength: data.length,
          hasLoginForm: data.includes('login') || data.includes('email') || data.includes('password')
        });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Connection error for ${url}: ${err.message}`);
      resolve({
        url,
        status: 'CONNECTION_ERROR',
        success: false,
        error: err.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

// Main test function
async function runTests() {
  console.log('🚀 Testing Admin Pages...');
  console.log('=' .repeat(50));
  
  for (const url of testUrls) {
    const result = await testUrl(url);
    const icon = result.success ? '✅' : '❌';
    let status = result.error ? `${result.status} (${result.error})` : result.status;
    
    if (result.redirect) {
      status += ` → ${result.redirect}`;
    }
    if (result.hasLoginForm) {
      status += ' [LOGIN_REQUIRED]';
    }
    if (result.contentLength) {
      status += ` (${result.contentLength} bytes)`;
    }
    
    console.log(`${icon} ${url} - ${status}`);
  }
  
  console.log('\n📊 Test Summary:');
  console.log('=' .repeat(50));
  
  const results = await Promise.all(testUrls.map(testUrl));
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`);
}

// Run the tests
runTests().catch(console.error);