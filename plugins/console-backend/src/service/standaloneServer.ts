import { createServiceBuilder } from '@backstage/backend-common';
import { Server } from 'http';
import { Logger } from 'winston';
import { createRouter, RouterOptions } from './router';
const io = require("socket.io")(Server);

export interface ServerOptions extends RouterOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'console-backend' });
  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    io: io, // Pass the io instance to createRouter
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/console', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
