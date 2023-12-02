import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
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
      import('./components/ConsoleComponent').then(m => m.ConsoleComponent),
    mountPoint: rootRouteRef,
  }),
);
