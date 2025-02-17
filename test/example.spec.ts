import { test, expect } from 'vitest'

test('o usuário consegue criar uma nova transação', async () => {
    // fazer a chamada HTTP p/ criar uma nova transação

    // validação
    const responseStatusCode = 201
    expect(responseStatusCode).toEqual(201)
})