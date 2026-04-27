import { Express } from "express";

import { openApiSpec } from "./openapi";

export const setupSwagger = (app: Express) => {
  app.get("/docs.json", (_req, res) => {
    return res.status(200).json(openApiSpec);
  });

  app.get("/docs", (_req, res) => {
    return res.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Swagger UI</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/docs.json',
        dom_id: '#swagger-ui'
      });
    </script>
  </body>
</html>`);
  });
};
