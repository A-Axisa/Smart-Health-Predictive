import user from '../scenarios/user.js';
import merchant from '../scenarios/merchant.js';
import admin from '../scenarios/admin.js';


export const options = {
  scenarios: {
    users: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 100 },
        { duration: '2m', target: 300 },
        { duration: '2m', target: 600 },
        { duration: '2m', target: 1000 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runUser',
    },

    merchants: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 25 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runMerchant',
    },

    admins: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 5 },
        { duration: '2m', target: 20 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 80 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runAdmin',
    },
  },
};

export function runUser() {
  user();
}

export function runMerchant() {
  merchant();
}

export function runAdmin() {
  admin();
}
