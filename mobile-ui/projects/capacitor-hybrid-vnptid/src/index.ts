import { registerPlugin } from '@capacitor/core';

import type { AuthSSOPlugin } from './definitions';

const AuthSSO = registerPlugin<AuthSSOPlugin>('AuthSSO', {
  web: () => import('./web').then((m) => new m.AuthSSOWeb()),
});

export * from './definitions';
export { AuthSSO };
