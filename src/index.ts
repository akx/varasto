#!/usr/bin/env ts-node
import express from 'express';
import yargs from 'yargs';

import { createServer } from './server';
import Storage from './storage';
import { normalizePort } from './utils';

const argv = yargs
  .usage(
    '$0 [options] <directory>',
    'Start the HTTP server.',
    (yargs: yargs.Argv) => yargs
      .option('p', {
        alias: 'port',
        nargs: 1,
        default: 3000,
        describe: 'Port which to listen to.',
        type: 'number',
      })
      .positional('directory', {
        describe: 'Directory where the items will be persisted into.',
        type: 'string',
        demand: true,
      })
      .help('h')
      .alias('h', 'help')
  )
  .argv;

const storage = new Storage({ dir: argv.directory as string });
const server = createServer(storage);
const port = normalizePort(argv.port as number);

server.on('error', (err: any) => {
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  if (err.syscall !== 'listen') {
    throw err;
  }

  // Handle specific listen errors with user friendly messages.
  switch (err.code) {
    case 'EACCES':
      process.stderr.write(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      process.stderr.write(`${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw err;
  }
});

server.listen(port, () => process.stdout.write(
  `Varasto is listening on ${port}\n`
));
