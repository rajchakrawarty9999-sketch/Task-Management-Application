// Comprehensive Production Security & Access Control Test Suite for TaskEngine PRO
async function runSecurityTests() {
  console.log('🛡️ ============================================================');
  console.log('🛡️ TaskEngine PRO — Production Security & Access Control Suite');
  console.log('🛡️ ============================================================\n');
  const baseUrl = 'http://localhost:5000/api';

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${message}`);
    } else {
      console.error(`❌ [FAIL] ${message}`);
      throw new Error(`Security Test Assertion Failed: ${message}`);
    }
  }

  // 1. Test: Unauthenticated POST /api/tasks (Should be rejected with 401)
  console.log('🔒 1. Testing Unauthenticated Mutation Protection:');
  const unauthRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Malicious Injected Task' })
  });
  assert(unauthRes.status === 401, `POST /api/tasks without JWT returns 401 Unauthorized (Got: ${unauthRes.status})`);

  // 2. Test: Invalid Token Rejection
  const badTokenRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer fake_invalid_jwt_token_xyz'
    },
    body: JSON.stringify({ title: 'Task with fake token' })
  });
  assert(badTokenRes.status === 401, `POST /api/tasks with forged token returns 401 Unauthorized (Got: ${badTokenRes.status})`);

  // 3. Test: Valid Demo Login & Token Issuance
  console.log('\n🔑 2. Testing Valid Token Authentication:');
  const loginRes = await fetch(`${baseUrl}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'u-1' })
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200 && Boolean(loginData.token), 'Valid demo-login returns 200 with JWT token');
  const validToken = loginData.token;

  // 4. Test: Invalid Payload Validation (Empty title should return 400)
  console.log('\n📝 3. Testing Input Validation & Sanitization:');
  const emptyTitleRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`
    },
    body: JSON.stringify({ title: '   ' })
  });
  assert(emptyTitleRes.status === 400, `POST /api/tasks with empty title returns 400 Bad Request (Got: ${emptyTitleRes.status})`);

  // 5. Test: Non-existent Task ID (Should return 404)
  console.log('\n🔍 4. Testing Resource Boundary Checks:');
  const notFoundRes = await fetch(`${baseUrl}/tasks/t-non-existent-99999`);
  assert(notFoundRes.status === 404, `GET /api/tasks/invalid-id returns 404 Not Found (Got: ${notFoundRes.status})`);

  // 6. Test: Password Hashes NOT Leaked in Public Endpoints
  console.log('\n🛡️ 5. Testing Sensitive Data Sanitization:');
  const usersRes = await fetch(`${baseUrl}/auth/users`);
  const users = await usersRes.json();
  const hasLeakedHash = users.some(u => Boolean(u.passwordHash || u.password_hash || u.password));
  assert(!hasLeakedHash, 'GET /api/auth/users strips all password hashes before returning');

  // 7. Test: Authenticated Task Creation & Workflow
  console.log('\n⚡ 6. Testing Authenticated CRUD with Valid Token:');
  const validCreateRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`
    },
    body: JSON.stringify({
      title: 'Production Security Hardening Verification',
      description: 'Validate authorization filters and boundary protections.',
      status: 'in_progress',
      priority: 'high',
      category: 'Security'
    })
  });
  const createdTask = await validCreateRes.json();
  assert(validCreateRes.status === 201 && createdTask.id, `Created task securely: ${createdTask.id}`);

  // 8. Test: Clean Deletion with Authorization
  const delRes = await fetch(`${baseUrl}/tasks/${createdTask.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${validToken}`
    }
  });
  assert(delRes.status === 200, `Deleted task securely: ${createdTask.id}`);

  console.log('\n============================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} PRODUCTION SECURITY AUDIT TESTS PASSED!`);
  console.log('============================================================');
}

runSecurityTests().catch(err => {
  console.error('\n❌ Security verification failed:', err.message);
  process.exit(1);
});
