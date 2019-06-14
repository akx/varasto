import express from 'express';
import morgan from 'morgan';

import { Storage } from 'varasto-storage';

export const createServer = (storage: Storage) => {
  const server = express();

  server.use(express.json());
  server.use(morgan('combined'));

  server.get('/:key', (req, res) => (
    storage.getItem(req.params.key)
      .then((value) => {
        if (typeof value === 'undefined') {
          res.status(404).json({
            error: 'Item does not exist.',
          });
        } else {
          res.status(200).json(value);
        }
      })
      .catch(() => res.status(500).json({
        error: 'Unable to retrieve item.',
      }))
  ));

  server.post('/:key', (req, res) => (
    storage.setItem(req.params.key, req.body)
      .then(() => res.status(201).json(req.body))
      .catch(() => res.status(500).json({
        error: 'Unable to store item.',
      }))
  ));

  server.delete('/:key', (req, res) => (
    storage.getItem(req.params.key)
      .then((value) => {
        if (typeof value === 'undefined') {
          res.status(404).json({
            error: 'Item does not exist.',
          });
        } else {
          storage.removeItem(req.params.key)
            .then(() => res.status(201).json(value))
            .catch(() => res.status(500).json({
              error: 'Unable to remove item.',
            }));
        }
      })
      .catch(() => res.status(500).json({
        error: 'Unable to remove item.',
      }))
  ));

  return server;
};
