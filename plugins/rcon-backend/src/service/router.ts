import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
var Rcon = require('rcon');

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
    // This minimal example connects and runs the "help" command.


    var conn = new Rcon('10.1.123.49', 25575, 'jVte9taruVnvqko6kawxSB7hWm8zR9d9ENUKJswd');

    conn.on('auth', function () {
      // You must wait until this event is fired before sending any commands,
      // otherwise those commands will fail.
      console.log("Authenticated");
      console.log("Sending command: list")
      conn.send("list");
    }).on('response', function (str: string) {
      console.log("Response: " + str);
    }).on('server', function (str: string) {
      console.log(str);
    }).on('error', function (err: string) {
      console.log("Error: " + err);
    }).on('end', function () {
      console.log("Connection closed");
      process.exit();
    });

    conn.connect();

    // connect() will return immediately.
    //
    // If you try to send a command here, it will fail since the connection isn't
    // authenticated yet. Wait for the 'auth' event.
  });
  router.use(errorHandler());
  return router;
}