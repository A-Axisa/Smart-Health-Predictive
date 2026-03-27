import user from '../scenarios/user';
import merchant from '../scenarios/merchant';
import admin from '../scenarios/admin';


export const options = {
  vus: 3,
  duration: '30s',
};

export default function () {
  user();
  merchant();
  admin();
}
