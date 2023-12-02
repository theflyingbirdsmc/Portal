import { legacyPlugin } from '@backstage/backend-common';
import { createBackend } from '@backstage/backend-defaults';
import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createSleepAction } from '@roadiehq/scaffolder-backend-module-utils';

const scaffolderModuleCustomExtensions = createBackendModule({
    pluginId: 'scaffolder', // name of the plugin that the module is targeting
    moduleId: 'customExtensions',
    register(env) {
        env.registerInit({
            deps: {
                scaffolder: scaffolderActionsExtensionPoint,
                config: coreServices.rootConfig,
                reader: coreServices.urlReader,
            },
            init({ scaffolder, config, reader /* ..., other dependencies */ }) {
                scaffolder.addActions(
                    createSleepAction(),
                );
                return Promise.resolve();
            },
        });
    },
});


const backend = createBackend();
backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(legacyPlugin('rcon', import('./plugins/rcon')));
backend.add(legacyPlugin('auth', import('./plugins/auth')));
backend.add(legacyPlugin('proxy', import('./plugins/proxy')));
backend.add(legacyPlugin('search', import('./plugins/search')));
backend.add(legacyPlugin('catalog', import('./plugins/catalog')))
backend.add(legacyPlugin('techdocs', import('./plugins/techdocs')));
backend.add(legacyPlugin('kubernetes', import('./plugins/kubernetes')));
backend.add(scaffolderModuleCustomExtensions());

backend.start();