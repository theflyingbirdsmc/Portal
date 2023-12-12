import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Server } from 'http'; // Import Server type from http

export interface RouterOptions {
  logger: Logger;
  io: Server; // Add io parameter to RouterOptions
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, io } = options; // Destructure io from options

  // const router = Router();
  // router.use(express.json());
  const app = express();
  app.set('socketio', io); // Set io instance to app
  // router.use(io);

  app.get('/health', (req, res) => {
    logger.info('PONG!');
    res.json({ status: 'ok' });
    const io = req.app.get('socketio');
    // Now you can use the io instance as needed
    io.emit('healthCheck', { status: 'ok' });
  });

  app.use(errorHandler());
  return app;
}
