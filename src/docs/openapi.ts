const port = process.env.PORT

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "hng14 API",
    version: "1.0.0",
    description:
      "API for gender classification, profile enrichment, profile search/filtering, and GitHub OAuth authentication.",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Classify" },
    { name: "Profiles" },
    { name: "Users" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "ValidationError: some error message" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "API is healthy" },
        },
      },
      RefreshTokenPayload: {
        type: "object",
        required: ["refresh_token"],
        properties: {
          refresh_token: { type: "string" },
        },
      },
      ClassifySuccessResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          message: { type: "string", example: "Gender prediction successful" },
          data: {
            type: "object",
            properties: {
              name: { type: "string", example: "anna" },
              gender: { type: "string", example: "female" },
              sample_size: { type: "number", example: 200 },
              probability: { type: "number", example: 0.9 },
              is_confident: { type: "boolean", example: true },
              processed_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
      CreateProfilePayload: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Anna" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/github": {
      get: {
        tags: ["Auth"],
        summary: "Redirect to GitHub OAuth consent page",
        responses: {
          "302": { description: "Redirect response" },
        },
      },
    },
    "/auth/github/callback": {
      get: {
        tags: ["Auth"],
        summary: "GitHub OAuth callback",
        parameters: [
          {
            in: "query",
            name: "code",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Authentication successful" },
          "400": {
            description: "No code provided",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Rotate refresh token and issue a new access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenPayload" },
            },
          },
        },
        responses: {
          "200": { description: "Token rotated successfully" },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { description: "Invalid refresh token" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Revoke refresh token",
        parameters: [
          {
            in: "header",
            name: "x-refresh-token",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Logout successful" },
          "400": {
            description: "Missing refresh token header",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/classify": {
      get: {
        tags: ["Classify"],
        summary: "Classify a name by gender",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "name",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Classification successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClassifySuccessResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/profiles": {
      get: {
        tags: ["Profiles"],
        summary: "Fetch profiles with filters",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Profiles fetched successfully" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Profiles"],
        summary: "Create a profile (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProfilePayload" },
            },
          },
        },
        responses: {
          "201": { description: "Profile created successfully" },
          "200": { description: "Profile already exists" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden: Admins only" },
        },
      },
    },
    "/api/profiles/upload": {
      post: {
        tags: ["Profiles"],
        summary: "Bulk upload profiles using multipart file",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Profiles uploaded successfully" },
          "400": { description: "No file uploaded / validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/profiles/search": {
      get: {
        tags: ["Profiles"],
        summary: "Search profiles using natural language query",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "q",
            required: true,
            schema: { type: "string" },
          },
          {
            in: "query",
            name: "page",
            required: false,
            schema: { type: "number", default: 1 },
          },
          {
            in: "query",
            name: "limit",
            required: false,
            schema: { type: "number", default: 10 },
          },
        ],
        responses: {
          "200": { description: "Profiles fetched successfully" },
          "400": { description: "Invalid query / unable to interpret query" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/profiles/{id}": {
      get: {
        tags: ["Profiles"],
        summary: "Fetch profile by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Profile fetched successfully" },
          "401": { description: "Unauthorized" },
          "404": { description: "Profile not found" },
        },
      },
      delete: {
        tags: ["Profiles"],
        summary: "Delete profile by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Profile deleted" },
          "401": { description: "Unauthorized" },
          "404": { description: "Profile not found" },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Fetch users",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Users fetched successfully" },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
};

