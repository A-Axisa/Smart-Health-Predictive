import user from '../scenarios/user';
import merchant from '../scenarios/merchant';
import admin from '../scenarios/admin';


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
