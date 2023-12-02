import express from 'express';
import Router from 'express-promise-router';
var compression = require('compression')
import { Logger } from 'winston';
import fs from 'fs';
const stream = require('stream');
var Rcon = require('rcon');
const k8s = require('@kubernetes/client-node');

export interface RouterOptions {
  logger: Logger;
}

// const formatLog2 = (log: string) => {
//   // Define ANSI escape codes for colors
//   const colors = {
//     error: '\x1b[31m',  // Red
//     info: '\x1b[32m',   // Green
//     warn: '\x1b[33m',   // Yellow
//     reset: '\x1b[0m',   // Reset color
//   };

//   // Identify the log type based on the message content (you can customize this logic)
//   const logType = log.includes('ERROR') ? 'error' : log.includes('INFO') ? 'info' : 'warn';
//   console.log("FOUND: " + logType);
//   // Return the formatted log with the appropriate color
//   return `${colors[logType]}${log}${colors.reset}`;
// };


type LogColors = {
  ERROR: string;
  INFO: string;
  WARN: string;
  RESET: string;
  WHITE: string;
};

const formatLog = (log: string) => {
  const colors: LogColors = {
    ERROR: '\x1b[31m',
    INFO: '\x1b[32m',
    WARN: '\x1b[33m',
    RESET: '\x1b[0m',
    WHITE: '\x1b[37m',
  };

  // Extract time and log type from the log
  const matches = log.match(/^\[([\d:]+)\s(\w+)]/);
  if (!matches) {
    return log; // Return the log unchanged if there are no matches
  }

  const time = matches[1];
  const logType = log.includes('ERROR') ? 'ERROR' : log.includes('INFO') ? 'INFO' : 'WARN';

  // Build the formatted log
  return `${colors.WHITE}[${time} ${colors[logType]}${logType}${colors.WHITE}]${log.slice(matches[0].length)}`;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());
  router.use(compression());

  router.post('/command', async (req, res) => {
    // logger.info('PONG!');
    // response.json({ status: 'ok' });
    // This minimal example connects and runs the "help" command.
    var conn = new Rcon('10.1.123.29', 25575, 'jVte9taruVnvqko6kawxSB7hWm8zR9d9ENUKJswd');
    const cmd = req.body.command;
    console.log("----COMMAND-----: " + cmd)
    // return cmd;
    conn.on('auth', function () {
      // You must wait until this event is fired before sending any commands,
      // otherwise those commands will fail.
      console.log("Authenticated");
      console.log("Sending command: " + cmd)
      conn.send(cmd);
    }).on('response', function (rcon: string) {
      console.log("Response: " + rcon);
      if (rcon) {
        res.send(JSON.stringify({ "rcon": `\u001b[36m[RCON]: ${rcon}` }));
      }
    }).on('error', function (err: string) {
      console.log("Error: " + err);
      res.send(JSON.stringify({ err }));
    }).on('end', function () {
      console.log("Connection closed");
      process.exit();
    });

    conn.connect();
  })
    .get('/logs', async (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const textDecoder = new TextDecoder('utf-8');
      const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));
      const kc = new k8s.KubeConfig();
      kc.loadFromDefault();

      const namespace = 'tfb-servers';
      const podname = "lobby-0"
      const log = new k8s.Log(kc);
      var data;

      const logStream = new stream.PassThrough();

      logStream.on('data', (chunk: Uint8Array) => {
        data = textDecoder.decode(chunk);
        var formattedLog = formatLog(data);
        res.write(`event: log\ndata: ${JSON.stringify({ formattedLog })}\n\n`);
        fs.appendFileSync("/home/coder/Backstage/plugins/rcon-backend/src/service/logs/log.txt", formattedLog);
        //@ts-ignore
        res.flush();
      });

      const main = async () => {
        try {
          await log.log(namespace, podname, 'lobby', logStream, {
            follow: true,
            tailLines: 50,
            pretty: false,
            timestamps: false,
          });
        } catch (err) {
          console.error(err);
          process.exit(1);
        }
      };
      main();
      res.on('close', () => {
        console.log('client dropped me');
        res.end();
      });
    })
    .get('/streaming', async (req, res) => {

      // Mandatory headers and http status to keep connection open
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'X-Accel-Buffering': 'no',
      });

      let counter = 0;
      let interValID = setInterval(() => {
        counter++;
        if (counter >= 10) {
          clearInterval(interValID);
          res.end(); // terminates SSE session
          return;
        }
        res.write(`data: ${JSON.stringify({ num: counter })}\n\n`); // res.write() instead of res.send()
        //@ts-ignore
        res.flush();
      }, 1000);

      // If client closes connection, stop sending events
      res.on('close', () => {
        console.log('client dropped me');
        clearInterval(interValID);
        res.end();
      });
    });
  return router;
}