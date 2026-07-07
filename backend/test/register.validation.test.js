import assert from "node:assert/strict";
import test from "node:test";
import { registerSchema } from "../src/modules/auth/auth.validation.js";
import { validateRequest } from "../src/middlewares/validation.js";

const validBody = {
  first_name: "  Customer ",
  last_name: " Demo ",
  register_no: "аа12345678",
  birth_date: "1995-01-15",
  phone: "99112233",
  email: "DEMO.Customer@Example.com",
};

test("registerSchema normalizes launch registration fields", () => {
  const result = registerSchema.parse({ body: validBody, params: {}, query: {} });

  assert.equal(result.body.first_name, "Customer");
  assert.equal(result.body.last_name, "Demo");
  assert.equal(result.body.register_no, "АА12345678");
  assert.equal(result.body.email, "demo.customer@example.com");
  assert.equal(result.body.username, undefined);
});

test("registerSchema rejects weak launch registration data", () => {
  const result = registerSchema.safeParse({
    body: { ...validBody, phone: "123" },
    params: {},
    query: {},
  });

  assert.equal(result.success, false);
});

test("register validation middleware rejects bad payloads before controller", () => {
  let statusCode;
  let payload;
  let nextCalled = false;
  const req = { body: { ...validBody, register_no: "bad" }, params: {}, query: {} };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      payload = body;
      return this;
    },
  };

  validateRequest(registerSchema)(req, res, () => { nextCalled = true; });

  assert.equal(statusCode, 400);
  assert.equal(payload.success, false);
  assert.equal(nextCalled, false);
});
