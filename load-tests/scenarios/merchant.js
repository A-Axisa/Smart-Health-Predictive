import http from "k6/http";
import { check, sleep } from "k6";


const BASE_URL = __ENV.BASEURL || 'http://localhost:8000';
const TEST_EMAIL = __ENV.TEST_EMAIL || 'service@example.com'
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'thisismypassword'

export default function () {
  // Test login.
  let loginResult = http.post(
    `${BASE_URL}/login`,
    JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  check(loginResult, {
    "login status 200": (r) => r.status === 200,
  });

  if (loginResult.status !== 200) return;
  sleep(1);

  // Test patient name retrieval.
  let getPatientsResult = http.get(`${BASE_URL}/merchants/patient-names`);
  check(getPatientsResult, {
    "patients status 200": (r) => r.status === 200,
  });
  sleep(1);

  // Test report retrieval.
  let getReportsResult = http.get(`${BASE_URL}/merchants/reports`);
  check(getReportsResult, {
    "reports status 200": (r) => r.status === 200,
  });
  sleep(1);

  // Test logout.
  let logoutResult = http.post(`${BASE_URL}/logout`, null, {
    headers: { "Content-Type": "application/json" },
  });
  check(logoutResult, {
    "logout status 200": (r) => r.status === 200,
  });
}
