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
- PostgreSQL
- Zod
- Vitest
- Supertest
- Dotenv
- TSUP
- ESLint

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/ViniAguiar1/apirest-nodejs.git
   ```
2. Navegue até o diretório do projeto:
   ```sh
   cd apirest-nodejs
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias:
   ```env
   NODE_ENV=development
   DATABASE_CLIENT=sqlite
   DATABASE_URL=./dev.sqlite3
   PORT=3333
   ```

2. Para o ambiente de teste, crie um arquivo `.env.test`:
   ```env
   NODE_ENV=test
   DATABASE_CLIENT=sqlite
   DATABASE_URL=./test.db
   PORT=3333
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

### Build

Para gerar o build do projeto, execute:
```sh
npm run build
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
│   ├── env
│   │   └── index.ts
│   └── database.ts
├── test
│   └── transactions.spec.ts
├── db
│   └── migrations
│       └── 20231010120000_create_transactions_table.js
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

## Contribuição

Se você deseja contribuir com este projeto, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Faça um push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença ISC.

