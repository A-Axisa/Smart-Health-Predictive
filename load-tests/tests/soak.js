import user from '../scenarios/user.js';
import merchant from '../scenarios/merchant.js';
import admin from '../scenarios/admin.js';


export const options = {
  scenarios: {
    users: {
      executor: 'constant-vus',
      vus: 200,
      duration: '2h',
      exec: 'runUser',
    },
    merchants: {
      executor: 'constant-vus',
      vus: 20,
      duration: '2h',
      exec: 'runMerchant',
    },
    admins: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2h',
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
