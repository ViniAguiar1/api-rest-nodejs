import { test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
    await app.ready()
})

afterAll(async () => {
    await app.close()
})

test('user can create a new transaction', async () => {
    // fazer a chamada HTTP p/ criar uma nova transação

    // validação
    await request(app.server)
        .post('/transactions')
        .send({
            title: 'Salário',
            amount: 1000,
            type: 'credit',
        })
        .expect(201)
})