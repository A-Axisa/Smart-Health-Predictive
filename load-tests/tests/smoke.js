import user from '../scenarios/user.js';
import merchant from '../scenarios/merchant.js';
import admin from '../scenarios/admin.js';


export const options = {
  scenarios: {
    users: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      exec: 'runUser'
    },
    merchants: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      exec: 'runMerchant'
    },
    admins: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      exec: 'runAdmin'
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
