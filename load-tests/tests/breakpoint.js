import user from '../scenarios/user';
import merchant from '../scenarios/merchant';
import admin from '../scenarios/admin';


export const options = {
  scenarios: {
    users: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 500 },
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 2000 },
        { duration: '1m', target: 2500 },
        { duration: '1m', target: 3000 },
        { duration: '1m', target: 3200 },
        { duration: '1m', target: 3400 },
        { duration: '30s', target: 3600 },
        { duration: '30s', target: 3800 },
        { duration: '10s', target: 4000 },
      ],
      exec: 'runUser',
    },

    merchants: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 20 },
        { duration: '1m', target: 40 },
        { duration: '1m', target: 80 },
        { duration: '1m', target: 100 },
        { duration: '1m', target: 150 },
        { duration: '1m', target: 200 },
        { duration: '1m', target: 220 },
        { duration: '1m', target: 240 },
        { duration: '30s', target: 260 },
        { duration: '30s', target: 280 },
        { duration: '10s', target: 300 },
      ],
      exec: 'runMerchant',
    },

    admins: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 5 },
        { duration: '1m', target: 10 },
        { duration: '1m', target: 15 },
        { duration: '1m', target: 20 },
        { duration: '1m', target: 25 },
        { duration: '1m', target: 30 },
        { duration: '1m', target: 35 },
        { duration: '30s', target: 40 },
        { duration: '30s', target: 45 },
        { duration: '10s', target: 50 },
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
