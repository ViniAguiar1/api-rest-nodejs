import { Knex } from 'knex';
import { knexConfig } from './src/database';

const config: { [key: string]: Knex.Config } = {
  development: {
    ...knexConfig,
    migrations: {
      extension: 'ts',
      directory: './db/migrations'
    }
  },
  // Adicione outras configurações de ambiente conforme necessário
};

module.exports = config;