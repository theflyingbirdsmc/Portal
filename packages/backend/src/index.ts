import { legacyPlugin } from '@backstage/backend-common';
import { createBackend } from '@backstage/backend-defaults';

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
backend.start();