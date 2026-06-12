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
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 400 },
        { duration: '2m', target: 600 },
        { duration: '2m', target: 800 },
        { duration: '2m', target: 1000 },
        { duration: '2m', target: 1500 },
        { duration: '2m', target: 2000 },
      ],
      exec: 'runUser',
    },

    merchants: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 10 },
        { duration: '2m', target: 20 },
        { duration: '2m', target: 40 },
        { duration: '2m', target: 60 },
        { duration: '2m', target: 80 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 150 },
        { duration: '2m', target: 200 },
      ],
      exec: 'runMerchant',
    },

    admins: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 2 },
        { duration: '2m', target: 4 },
        { duration: '2m', target: 8 },
        { duration: '2m', target: 12 },
        { duration: '2m', target: 16 },
        { duration: '2m', target: 20 },
        { duration: '2m', target: 30 },
        { duration: '2m', target: 40 },
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
