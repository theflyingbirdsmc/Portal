/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
// import { createBackendModule } from '@backstage/backend-plugin-api';
// import { eventsModuleGithubEventRouter } from '@backstage/plugin-events-backend-module-github/alpha';
// import { eventsModuleGithubWebhook } from '@backstage/plugin-events-backend-module-github/alpha';
// import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
// import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
// import { coreServices } from '@backstage/backend-plugin-api';
import { legacyPlugin } from '@backstage/backend-common';

// const root = getRootLogger();
const backend = createBackend();

// const catalogModuleCustomExtensions = createBackendModule({
//   pluginId: 'catalog', // name of the plugin that the module is targeting
//   moduleId: 'customExtensions',
//   register(env) {
//     env.registerInit({
//       deps: {
//         catalog: catalogProcessingExtensionPoint,
//         config: coreServices.rootConfig,
//         schedule: coreServices.scheduler
//       },
//       init({ catalog, config, schedule }) {
//         catalog.addEntityProvider(
//           GithubEntityProvider.fromConfig(config, {
//             logger: root,
//             schedule: schedule.createScheduledTaskRunner({
//               frequency: { minutes: 5 },
//               timeout: { minutes: 3 },
//             }),
//           }),
//         );
//         return Promise.resolve();
//       },
//     });
//   },
// });

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// auth plugin
backend.add(legacyPlugin('auth', import('./plugins/auth')));
// backend.add(import('@backstage/plugin-auth-backend'));
// backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
// backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://github.com/backstage/backstage/blob/master/docs/auth/guest/provider.md

// catalog plugin
backend.add(legacyPlugin('catalog', import('./plugins/catalog')));
// backend.add(import('@backstage/plugin-catalog-backend/alpha'));
// backend.add(
//   import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
// );
// backend.add(import('@backstage/plugin-events-backend/alpha'));
// // backend.add(catalogModuleCustomExtensions);
// backend.add(eventsModuleGithubEventRouter());
// backend.add(eventsModuleGithubWebhook());

// permission plugin
backend.add(import('@backstage/plugin-permission-backend/alpha'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

backend.start();
