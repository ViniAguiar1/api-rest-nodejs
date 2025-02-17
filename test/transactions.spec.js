"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_child_process_1 = require("node:child_process");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
(0, vitest_1.describe)('Transactions routes', () => {
    (0, vitest_1.beforeAll)(async () => {
        console.log('Running in', process.env.NODE_ENV, 'environment');
        await app_1.app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app_1.app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        (0, node_child_process_1.execSync)('npm run migrate:rollback-all');
        (0, node_child_process_1.execSync)('npm run migrate:latest');
    });
    (0, vitest_1.test)('user can create a new transaction', async () => {
        // fazer a chamada HTTP p/ criar uma nova transação
        // validação
        const response = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'Salário',
            amount: 1000,
            type: 'credit',
        })
            .expect(201);
        console.log(response.body);
    });
    (0, vitest_1.test)('user can list all transactions', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'Salário',
            amount: 1000,
            type: 'credit',
        });
        const cookies = createTransactionResponse.get('Set-Cookie');
        if (!cookies) {
            throw new Error('Cookies not set');
        }
        const listTransactionsResponse = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(listTransactionsResponse.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: 'Salário',
                amount: 1000,
            }),
        ]);
        console.log(listTransactionsResponse.body);
    });
    (0, vitest_1.test)('user can list a specific transaction', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'Salário',
            amount: 1000,
            type: 'credit',
        });
        const cookies = createTransactionResponse.get('Set-Cookie');
        if (!cookies) {
            throw new Error('Cookies not set');
        }
        const listTransactionsResponse = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        const transactionId = listTransactionsResponse.body.transactions[0].id;
        const getTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(getTransactionResponse.body.transaction).toEqual(vitest_1.expect.objectContaining({
            title: 'Salário',
            amount: 1000,
        }));
        console.log(listTransactionsResponse.body);
    });
    (0, vitest_1.test)('user can list a summary about transactions', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'Salário',
            amount: 1000,
            type: 'credit',
        });
        const cookies = createTransactionResponse.get('Set-Cookie');
        await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
            title: 'Debit transaction',
            amount: 300,
            type: 'credit',
        });
        if (!cookies) {
            throw new Error('Cookies not set');
        }
        const summaryResponse = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(summaryResponse.body.summary).toEqual({
            amount: 1300,
        });
        console.log(summaryResponse.body);
    });
});
