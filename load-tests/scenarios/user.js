import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:8000";

export default function () {
  // Test login.
  let loginResult = http.post(
    `${BASE_URL}/login`,
    JSON.stringify({
      email: "audrey.young@example.com",
      password: "whyaretherebirds",
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

  // Test health upload.
  let uploadReportResult = http.post(
    `${BASE_URL}/health-prediction/`,
    JSON.stringify({
      age: 24,
      weight: 81,
      height: 176,
      gender: "Male",
      blood_glucose: 5,
      ap_hi: 120,
      ap_lo: 80,
      high_cholesterol: 0,
      hyper_tension: 0,
      heart_disease: 0,
      diabetes: 0,
      alcohol: 0,
      smoker: "No",
      marital_status: "Single",
      working_status: "Working",
      stroke: 0,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  check(uploadReportResult, {
    "prediction status 200": (r) => r.status === 200,
  });
  sleep(1);

  // Test health data dates retrieval.
  let getDatesResult = http.get(`${BASE_URL}/getHealthDataDates`);
  check(getDatesResult, {
    "date status 200": (r) => r.status === 200,
  });
  sleep(1);

  // Test report retrieval.
  let dates = JSON.parse(getDatesResult.body);
  let id = dates.length > 0 ? dates[0].healthDataID : null;

  if (id) {
    let getReportResult = http.get(`${BASE_URL}/report-data/${id}`);
    check(getReportResult, {
      "report status 200": (r) => r.status === 200,
    });
    sleep(1);
  }

  // Test health analytics retrieval.
  let getAnalyticsResult = http.get(`${BASE_URL}//health-analytics`);
  check(getAnalyticsResult, {
    "analytics status 200": (r) => r.status === 200,
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
