import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
import { authDocs } from "../modules/auth/auth.swager";
import { eventDocs } from "../modules/event/event.swagger";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My Express API Docs",
    version: "1.0.0",
    description: "API documentation for my existing Express TypeScript project",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development server",
    },
  ],
  paths: {
    ...authDocs,
    ...eventDocs,
    // ...adminSwaggerDoc,
    // ...socialPostDocs,
    // ...chatSwaggerDoc,
    // ...mcqBankSwaggerDoc,
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options: Options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "../module/**/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger docs available at http://localhost:5000/api-docs");
};
