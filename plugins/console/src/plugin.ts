import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const consolePlugin = createPlugin({
  id: 'console',
  routes: {
    root: rootRouteRef,
  },
});

export const ConsolePage = consolePlugin.provide(
  createRoutableExtension({
    name: 'ConsolePage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
