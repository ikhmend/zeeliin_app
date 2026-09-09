import assert from "node:assert/strict";
import test from "node:test";
import { addMonthsClamped } from "../src/modules/installments/installments.service.js";
import { makePaymentSchema } from "../src/modules/personal/personal.validation.js";
import { updateProfileSchema } from "../src/modules/personal/personal.validation.js";

test("installment dates clamp to the target month's last day", () => {
  assert.equal(addMonthsClamped("2024-01-31", 1), "2024-02-29");
  assert.equal(addMonthsClamped("2024-01-31", 2), "2024-03-31");
});

test("payments reject fractions smaller than one cent", () => {
  const result = makePaymentSchema.safeParse({
    body: { payment_amount: 10.001, payment_method: "qpay" },
    params: { loanId: 1 },
    query: {},
  });
  assert.equal(result.success, false);
});

test("employment manager phone must be eight digits", () => {
  const result = updateProfileSchema.safeParse({
    body: { employment: { manager_phone: "123" } },
    params: {},
    query: {},
  });
  assert.equal(result.success, false);
});
