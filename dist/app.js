"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_cookie = __toESM(require("@fastify/cookie"));

// src/routes/transactions.ts
var import_zod2 = require("zod");
var import_node_crypto = __toESM(require("crypto"));

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_config = require("dotenv/config");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  console.log("\u{1F6A8} Running in test environment");
  (0, import_dotenv.config)({
    path: ".env.test"
  });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u{1F388} Invalid environment variables!", _env.error.format());
  throw new Error("\u{1F388} Invalid environment variables!");
}
var env = _env.data;

// src/database.ts
var knexConfig = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(knexConfig);

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(req, res) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).send({
      error: "Unauthorized"
    });
  }
}

// src/routes/transactions.ts
async function TransactionsRoutes(app2) {
  app2.addHook("preHandler", async (req, res) => {
    console.log(`[${req.method}] ${req.url}`);
  });
  app2.post(
    "/",
    {
      schema: {
        description: "Cria uma nova transa\xE7\xE3o",
        tags: ["transactions"],
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            amount: { type: "number" },
            type: { type: "string", enum: ["credit", "debit"] }
          },
          required: ["title", "amount", "type"]
        },
        response: {
          201: {
            description: "Transa\xE7\xE3o criada com sucesso",
            type: "string"
          }
        }
      }
    },
    async (req, res) => {
      const createTransactionSchema = import_zod2.z.object({
        title: import_zod2.z.string(),
        amount: import_zod2.z.number(),
        type: import_zod2.z.enum(["credit", "debit"])
      });
      const { title, amount, type } = createTransactionSchema.parse(req.body);
      let sessionId = req.cookies.sessionId;
      if (!sessionId) {
        sessionId = import_node_crypto.default.randomUUID();
        res.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7
          // 1 week
        });
      }
      await knex("transactions").insert({
        id: import_node_crypto.default.randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        session_id: sessionId
      });
      return res.status(201).send("Transaction created");
    }
  );
  app2.get(
    "/",
    {
      schema: {
        description: "Get all transactions",
        tags: ["transactions"],
        response: {
          200: {
            description: "Lista de transa\xE7\xF5es",
            type: "object",
            properties: {
              transactions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    title: { type: "string" },
                    amount: { type: "number" },
                    type: { type: "string", enum: ["credit", "debit"] }
                  }
                }
              }
            }
          }
        }
      },
      preHandler: [checkSessionIdExists]
    },
    async (req, res) => {
      const { sessionId } = req.cookies;
      const transactions = await knex("transactions").where("session_id", sessionId).select("*");
      return { transactions };
    }
  );
  app2.get(
    "/:id",
    {
      schema: {
        description: "Get a single transaction by ID",
        tags: ["transactions"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" }
          },
          required: ["id"]
        },
        response: {
          200: {
            description: "Transa\xE7\xE3o encontrada",
            type: "object",
            properties: {
              transaction: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  amount: { type: "number" },
                  type: { type: "string", enum: ["credit", "debit"] }
                }
              }
            }
          },
          404: {
            description: "Transa\xE7\xE3o n\xE3o encontrada",
            type: "string",
            example: "Transaction not found"
          }
        }
      },
      preHandler: [checkSessionIdExists]
    },
    async (req, res) => {
      const getTrasanctionsParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getTrasanctionsParamsSchema.parse(req.params);
      const { sessionId } = req.cookies;
      const transaction = await knex("transactions").where({
        id,
        session_id: sessionId
      }).first();
      if (!transaction) {
        return res.status(404).send("Transaction not found");
      }
      return { transaction };
    }
  );
  app2.get(
    "/summary",
    {
      schema: {
        description: "Get the summary of all transactions (total amount)",
        tags: ["transactions"],
        response: {
          200: {
            description: "Resumo das transa\xE7\xF5es",
            type: "object",
            properties: {
              summary: {
                type: "object",
                properties: {
                  amount: { type: "number" }
                  // A soma total do campo "amount"
                }
              }
            }
          }
        }
      },
      preHandler: [checkSessionIdExists]
    },
    async (req, res) => {
      const { sessionId } = req.cookies;
      const summary = await knex("transactions").sum("amount", { as: "amount" }).where("session_id", sessionId).first();
      return { summary };
    }
  );
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(import_swagger.default, {
  swagger: {
    info: {
      title: "API de Transa\xE7\xF5es",
      description: "API para gerenciar transa\xE7\xF5es",
      version: "1.0.0"
    },
    host: "localhost:3000",
    tags: [
      { name: "transactions", description: "Gest\xE3o de transa\xE7\xF5es" }
    ],
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"]
  }
});
app.register(import_swagger_ui.default, {
  routePrefix: "/documentation",
  // Caminho para acessar a documentação
  uiConfig: {
    docExpansion: "none",
    // Define para não expandir os métodos por padrão
    deepLinking: false
  },
  staticCSP: true,
  exposeRoute: true
  // Torna a rota de documentação disponível
});
app.register(TransactionsRoutes, {
  prefix: "/transactions"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
