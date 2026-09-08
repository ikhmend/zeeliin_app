const ok = { description: "Амжилттай." };
const created = { description: "Амжилттай үүслээ." };
const unauthorized = {
  description: "Нэвтрэх шаардлагатай эсвэл token хүчингүй.",
};

const loanId = {
  name: "loanId",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
};

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Zeeliin API",
    version: "1.0.0",
    description: "Зээлийн системийн HTTP API.",
  },
  servers: [{ url: "/" }],
  tags: [{ name: "System" }, { name: "Auth" }, { name: "Personal" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Login: {
        type: "object",
        required: ["login", "password"],
        properties: {
          login: { type: "string", example: "demo" },
          password: {
            type: "string",
            format: "password",
            example: "DemoPass123",
          },
        },
      },
      Register: {
        type: "object",
        required: [
          "first_name",
          "last_name",
          "register_no",
          "birth_date",
          "phone",
          "email",
        ],
        properties: {
          first_name: { type: "string", example: "Бат" },
          last_name: { type: "string", example: "Болд" },
          register_no: {
            type: "string",
            pattern: "^[А-ЯӨҮЁA-Z]{2}\\d{8}$",
            example: "УБ99112233",
          },
          birth_date: { type: "string", format: "date", example: "1999-11-22" },
          phone: { type: "string", pattern: "^\\d{8}$", example: "99112233" },
          email: {
            type: "string",
            format: "email",
            example: "bat@example.com",
          },
          username: { type: "string", example: "batbold" },
        },
      },
      PasswordChange: {
        type: "object",
        required: ["currentPass", "newPass", "confirmPass"],
        properties: {
          currentPass: { type: "string", format: "password" },
          newPass: { type: "string", format: "password", minLength: 8 },
          confirmPass: { type: "string", format: "password" },
        },
      },
      Payment: {
        type: "object",
        required: ["payment_amount", "payment_method"],
        properties: {
          payment_amount: { type: "number", minimum: 0.01, example: 50000 },
          payment_method: {
            type: "string",
            enum: ["cash", "bank_transfer", "qpay", "card"],
          },
          note: { type: "string", maxLength: 500 },
        },
      },
      ProfileUpdate: {
        type: "object",
        minProperties: 1,
        properties: {
          phone: { type: "string", pattern: "^\\d{8}$" },
          home_phone: { type: "string", pattern: "^\\d{8}$" },
          email: { type: "string", format: "email", nullable: true },
          social: { type: "string", nullable: true },
          activity_dir: { type: "string", nullable: true },
          business_type: { type: "string", nullable: true },
          education: { type: "string", nullable: true },
          profession: { type: "string", nullable: true },
          official_address: { type: "string", nullable: true },
          current_address: { type: "string", nullable: true },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Liveness check",
        responses: { 200: ok },
      },
    },
    "/ready": {
      get: {
        tags: ["System"],
        summary: "Database readiness check",
        responses: { 200: ok, 503: { description: "Систем бэлэн биш." } },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Бүртгүүлэх",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Register" },
            },
          },
        },
        responses: {
          201: created,
          400: { description: "Буруу хүсэлт." },
          409: { description: "Давхардсан мэдээлэл." },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Нэвтрэх",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Login" },
            },
          },
        },
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/auth/personal": {
      get: {
        tags: ["Auth"],
        summary: "Нэвтэрсэн хэрэглэгч",
        security: [{ bearerAuth: [] }],
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/auth/password": {
      patch: {
        tags: ["Auth"],
        summary: "Нууц үг солих",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasswordChange" },
            },
          },
        },
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Access token шинэчлэх",
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/auth/logout": {
      post: { tags: ["Auth"], summary: "Гарах", responses: { 200: ok } },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Нууц үг сэргээх холбоос илгээх",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email" } },
              },
            },
          },
        },
        responses: { 200: ok },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Нууц үг сэргээх",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword", "confirmPassword"],
                properties: {
                  token: { type: "string" },
                  newPassword: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                  },
                  confirmPassword: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: { 200: ok },
      },
    },
    "/api/me/dashboard": {
      get: {
        tags: ["Personal"],
        summary: "Хянах самбар",
        security: [{ bearerAuth: [] }],
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/me/profile": {
      get: {
        tags: ["Personal"],
        summary: "Профайл",
        security: [{ bearerAuth: [] }],
        responses: { 200: ok, 401: unauthorized },
      },
      put: {
        tags: ["Personal"],
        summary: "Профайл шинэчлэх",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProfileUpdate" },
            },
          },
        },
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/me/payments": {
      get: {
        tags: ["Personal"],
        summary: "Миний төлөлтүүд",
        security: [{ bearerAuth: [] }],
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/me/loans": {
      get: {
        tags: ["Personal"],
        summary: "Миний зээлүүд",
        security: [{ bearerAuth: [] }],
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/me/loans/{loanId}": {
      get: {
        tags: ["Personal"],
        summary: "Нэг зээл",
        security: [{ bearerAuth: [] }],
        parameters: [loanId],
        responses: {
          200: ok,
          401: unauthorized,
          404: { description: "Зээл олдсонгүй." },
        },
      },
    },
    "/api/me/loans/{loanId}/installments": {
      get: {
        tags: ["Personal"],
        summary: "Зээлийн төлөлтийн хуваарь",
        security: [{ bearerAuth: [] }],
        parameters: [loanId],
        responses: { 200: ok, 401: unauthorized },
      },
    },
    "/api/me/loans/{loanId}/payments": {
      get: {
        tags: ["Personal"],
        summary: "Зээлийн төлөлтийн түүх",
        security: [{ bearerAuth: [] }],
        parameters: [loanId],
        responses: { 200: ok, 401: unauthorized },
      },
      post: {
        tags: ["Personal"],
        summary: "Төлөлт хийх",
        security: [{ bearerAuth: [] }],
        parameters: [loanId],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Payment" },
            },
          },
        },
        responses: { 201: created, 401: unauthorized },
      },
    },
  },
};
