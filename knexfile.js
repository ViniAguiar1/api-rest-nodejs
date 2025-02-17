"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./src/database");
const config = {
    development: {
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            user: 'your_database_user',
            password: 'your_database_password',
            database: 'myapp_test'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
module.exports = config;
