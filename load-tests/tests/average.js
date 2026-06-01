import user from '../scenarios/user.js';
import merchant from '../scenarios/merchant.js';
import admin from '../scenarios/admin.js';


const HAS_USER = __ENV.USER_EMAIL && __ENV.USER_PASSWORD;
const HAS_MERCHANT = __ENV.MERCHANT_EMAIL && __ENV.MERCHANT_PASSWORD;
const HAS_ADMIN = __ENV.ADMIN_EMAIL && __ENV.ADMIN_PASSWORD;

export const options = {
  scenarios: {
    users: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      exec: 'runUser',
    },

    merchants: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
      exec: 'runMerchant',
    },

    admins: {
      executor: 'constant-vus',
      vus: 2,
      duration: '5m',
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
