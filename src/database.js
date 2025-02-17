const knex = require('knex');
const knexfile = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

if (!config) {
  throw new Error(`No knex configuration found for environment: ${environment}`);
}

const connection = knex(config);

module.exports = connection;
