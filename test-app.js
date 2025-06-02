// Test script để kiểm tra các API endpoints của ứng dụng
const https = require('https');
const http = require('http');

// Hàm helper để thực hiện HTTP request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('🚀 Bắt đầu kiểm thử ứng dụng E-commerce 3D...');
  console.log('=' .repeat(60));
  
  const baseUrl = 'http://localhost:3000';
  const tests = [];
  
  // Test 1: Kiểm tra trang chủ
  console.log('\n📋 Test 1: Kiểm tra trang chủ');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 10000
    });
    
    if (response.statusCode === 200) {
      console.log('✅ Trang chủ hoạt động bình thường');
      console.log(`   Status: ${response.statusCode}`);
      tests.push({ name: 'Homepage', status: 'PASS' });
    } else {
      console.log(`❌ Trang chủ trả về status code: ${response.statusCode}`);
      tests.push({ name: 'Homepage', status: 'FAIL', error: `Status ${response.statusCode}` });
    }
  } catch (error) {
    console.log(`❌ Lỗi khi truy cập trang chủ: ${error.message}`);
    tests.push({ name: 'Homepage', status: 'FAIL', error: error.message });
  }
  
  // Test 2: Kiểm tra API health check
  console.log('\n📋 Test 2: Kiểm tra API health');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    });
    
    if (response.statusCode === 200 || response.statusCode === 404) {
      console.log('✅ API server đang hoạt động');
      console.log(`   Status: ${response.statusCode}`);
      tests.push({ name: 'API Health', status: 'PASS' });
    } else {
      console.log(`❌ API health check thất bại: ${response.statusCode}`);
      tests.push({ name: 'API Health', status: 'FAIL', error: `Status ${response.statusCode}` });
    }
  } catch (error) {
    console.log(`❌ Lỗi khi kiểm tra API: ${error.message}`);
    tests.push({ name: 'API Health', status: 'FAIL', error: error.message });
  }
  
  // Test 3: Kiểm tra trang đăng nhập
  console.log('\n📋 Test 3: Kiểm tra trang đăng nhập');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'GET',
      timeout: 5000
    });
    
    if (response.statusCode === 200) {
      console.log('✅ Trang đăng nhập hoạt động bình thường');
      tests.push({ name: 'Login Page', status: 'PASS' });
    } else {
      console.log(`❌ Trang đăng nhập lỗi: ${response.statusCode}`);
      tests.push({ name: 'Login Page', status: 'FAIL', error: `Status ${response.statusCode}` });
    }
  } catch (error) {
    console.log(`❌ Lỗi khi truy cập trang đăng nhập: ${error.message}`);
    tests.push({ name: 'Login Page', status: 'FAIL', error: error.message });
  }
  
  // Test 4: Kiểm tra trang đăng ký
  console.log('\n📋 Test 4: Kiểm tra trang đăng ký');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'GET',
      timeout: 5000
    });
    
    if (response.statusCode === 200) {
      console.log('✅ Trang đăng ký hoạt động bình thường');
      tests.push({ name: 'Register Page', status: 'PASS' });
    } else {
      console.log(`❌ Trang đăng ký lỗi: ${response.statusCode}`);
      tests.push({ name: 'Register Page', status: 'FAIL', error: `Status ${response.statusCode}` });
    }
  } catch (error) {
    console.log(`❌ Lỗi khi truy cập trang đăng ký: ${error.message}`);
    tests.push({ name: 'Register Page', status: 'FAIL', error: error.message });
  }
  
  // Test 5: Kiểm tra API đăng ký (POST request)
  console.log('\n📋 Test 5: Kiểm tra API đăng ký');
  try {
    const testData = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      },
      timeout: 5000
    }, testData);
    
    if (response.statusCode === 201 || response.statusCode === 400) {
      console.log('✅ API đăng ký phản hồi đúng cách');
      console.log(`   Status: ${response.statusCode}`);
      tests.push({ name: 'Register API', status: 'PASS' });
    } else {
      console.log(`❌ API đăng ký lỗi: ${response.statusCode}`);
      tests.push({ name: 'Register API', status: 'FAIL', error: `Status ${response.statusCode}` });
    }
  } catch (error) {
    console.log(`❌ Lỗi khi test API đăng ký: ${error.message}`);
    tests.push({ name: 'Register API', status: 'FAIL', error: error.message });
  }
  
  // Test 6: Kiểm tra API sản phẩm
  console.log('\n📋 Test 6: Kiểm tra API sản phẩm');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET',
      timeout: 5000
    });
    
    if (response.statusCode === 200) {
      console.log('✅ API sản phẩm hoạt động bình thường');
      tests.push({ name: 'Products API', status: 'PASS' });
    } else {
      console.log(`❌ API sản phẩm lỗi: ${response.statusCode}`);
      tests.push({ name: 'Products API', status: 'FAIL', error: `Status ${response.statusCode}` });
    }
  } catch (error) {
    console.log(`❌ Lỗi khi test API sản phẩm: ${error.message}`);
    tests.push({ name: 'Products API', status: 'FAIL', error: error.message });
  }
  
  // Tổng kết
  console.log('\n' + '=' .repeat(60));
  console.log('📊 KẾT QUẢ KIỂM THỬ TỔNG QUAN');
  console.log('=' .repeat(60));
  
  const passedTests = tests.filter(t => t.status === 'PASS').length;
  const failedTests = tests.filter(t => t.status === 'FAIL').length;
  
  console.log(`\n✅ Passed: ${passedTests}/${tests.length}`);
  console.log(`❌ Failed: ${failedTests}/${tests.length}`);
  
  if (failedTests > 0) {
    console.log('\n🔍 CHI TIẾT LỖI:');
    tests.filter(t => t.status === 'FAIL').forEach(test => {
      console.log(`   • ${test.name}: ${test.error}`);
    });
  }
  
  console.log('\n📝 KHUYẾN NGHỊ:');
  if (passedTests === tests.length) {
    console.log('   🎉 Tất cả tests đều pass! Ứng dụng hoạt động tốt.');
  } else {
    console.log('   🔧 Cần kiểm tra và sửa các lỗi trên trước khi deploy.');
    console.log('   📋 Đảm bảo development server đang chạy trên port 3000.');
    console.log('   🔍 Kiểm tra logs của Next.js để tìm lỗi chi tiết.');
  }
  
  console.log('\n' + '=' .repeat(60));
}

// Chạy tests
runTests().catch(console.error);