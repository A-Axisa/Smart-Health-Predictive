import user from '../scenarios/user';
import merchant from '../scenarios/merchant';
import admin from '../scenarios/admin';


export const options = {
  scenarios: {
    users: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 200 },
        { duration: '30s', target: 1000 },
        { duration: '1m', target: 2000 },
        { duration: '30s', target: 200 },
      ],
      exec: 'runUser',
    },

    merchants: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 20 },
        { duration: '30s', target: 200 },
        { duration: '1m', target: 400 },
        { duration: '30s', target: 20 },
      ],
      exec: 'runMerchant',
    },

    admins: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 5 },
        { duration: '30s', target: 10 },
        { duration: '1m', target: 30 },
        { duration: '30s', target: 5 },
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
