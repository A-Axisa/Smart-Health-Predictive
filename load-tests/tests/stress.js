import user from '../scenarios/user.js';
import merchant from '../scenarios/merchant.js';
import admin from '../scenarios/admin.js';


const HAS_USER = __ENV.USER_EMAIL && __ENV.USER_PASSWORD;
const HAS_MERCHANT = __ENV.MERCHANT_EMAIL && __ENV.MERCHANT_PASSWORD;
const HAS_ADMIN = __ENV.ADMIN_EMAIL && __ENV.ADMIN_PASSWORD;

export const options = {
  scenarios: {
    users: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 50 },
        { duration: '2m', target: 150 },
        { duration: '2m', target: 300 },
        { duration: '2m', target: 500 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runUser',
    },

    merchants: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 5 },
        { duration: '2m', target: 15 },
        { duration: '2m', target: 30 },
        { duration: '2m', target: 50 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runMerchant',
    },

    admins: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 1 },
        { duration: '2m', target: 3 },
        { duration: '2m', target: 6 },
        { duration: '2m', target: 10 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runAdmin',
    },
  },
};

export function runUser() {
  if (!HAS_USER) return;
  user();
}

export function runMerchant() {
  if (!HAS_USER) return;
  merchant();
}

export function runAdmin() {
  if (!HAS_ADMIN) return;
  admin();
}
 