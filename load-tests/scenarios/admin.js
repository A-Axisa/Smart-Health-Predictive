import http from 'k6/http';
import { check, sleep } from 'k6';


const BASE_URL = 'http://localhost:8000';

export default function () {
  // Test login.
  let loginResult = http.post(`${BASE_URL}/login`,
    JSON.stringify({
      email: 'SHP_Admin@example.com',
      password: 'password12345678',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(loginResult, {
    'login status 200': r => r.status === 200
  });

  if (loginResult.status !== 200) return;
  sleep(1);

  // Test user retreival.
  let getUsersResult = http.get(`${BASE_URL}/users`);
  check(getUsersResult, {
    'clinics status 200': r => r.status === 200
  });
  sleep(1);
  
  // Test log retreival.
  let getLogsResult = http.get(`${BASE_URL}/logs`);
  check(getLogsResult, {
    'logs status 200': r => r.status === 200
  });
  sleep(1);

  // Test logout.
  let logoutResult = http.post(`${BASE_URL}/logout`, null, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(logoutResult, {
    'logout status 200': r => r.status === 200
  });
}
