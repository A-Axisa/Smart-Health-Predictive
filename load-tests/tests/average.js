import user from '../scenarios/user.js';
import merchant from '../scenarios/merchant.js';
import admin from '../scenarios/admin.js';


export const options = {
  scenarios: {
    users: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '5m',
      exec: 'runUser',
    },
    merchants: {
      executor: 'constant-vus',
      vus: 100,
      duration: '5m',
      exec: 'runMerchant',
    },
    admins: {
      executor: 'constant-vus',
      vus: 5,
      duration: '5m',
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
