# API REST Node.js

## Descrição

Esta é uma API REST para gerenciar transações financeiras, construída com Node.js e Fastify. A API permite criar, listar, visualizar e obter um resumo das transações.

## Funcionalidades

### Requisitos Funcionais (RF)

- [x] O usuário deve poder criar uma nova transação.
- [x] O usuário deve poder obter um resumo da sua conta.
- [x] O usuário deve poder listar todas as transações que já ocorreram.
- [x] O usuário deve poder visualizar uma transação única.

### Regras de Negócio (RN)

- [x] A transação pode ser do tipo crédito, que somará ao valor total, ou débito, que subtrairá.
- [x] Deve ser possível identificar o usuário entre as requisições.
- [x] O usuário só pode visualizar transações que ele criou.

## Tecnologias Utilizadas

- Node.js
- Fastify
- TypeScript
- Knex.js
- SQLite
- Zod
- Vitest
- Supertest

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/apirest-nodejs.git
   ```
2. Navegue até o diretório do projeto:
   ```sh
   cd apirest-nodejs
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```

## Uso

### Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento, execute:
```sh
npm run dev
```

### Testes

Para rodar os testes, execute:
```sh
npm run test
```

## Estrutura do Projeto

```plaintext
/C:/viniaguiar/apirest-nodejs
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── routes
│   │   └── transactions.ts
│   ├── middlewares
│   │   └── check-session-id-exists.ts
│   └── database.ts
├── test
│   └── example.spec.ts
├── package.json
└── README.md
```

## Endpoints

### Criar Transação

- **POST** `/transactions`
  - Body:
    ```json
    {
      "title": "Salário",
      "amount": 1000,
      "type": "credit"
    }
    ```

### Listar Transações

- **GET** `/transactions`

### Visualizar Transação por ID

- **GET** `/transactions/:id`

### Resumo das Transações

- **GET** `/transactions/summary`

## Licença

Este projeto está licenciado sob a licença ISC.

