"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./src/database");
const config = {
    development: {
        ...database_1.knexConfig,
        migrations: {
            extension: 'ts',
            directory: './db/migrations'
        }
    },
    // Adicione outras configurações de ambiente conforme necessário
};
module.exports = config;
