import assert from "node:assert/strict";
import test from "node:test";
import migration from "../migrations/20260707000100-launch-schema.cjs";
import seed from "../seeders/20260707000200-demo-personal-customer.cjs";

test("launch migration creates the tables required by personal loans", async () => {
  const created = [];
  const queryInterface = {
    createTable: async (name, columns) => created.push([name, columns]),
    dropTable: async () => {},
  };
  const type = (name) => Object.assign(() => name, { type: name });
  const Sequelize = new Proxy({}, {
    get: (_, prop) => prop === "fn" ? () => "NOW" : type(prop),
  });

  await migration.up(queryInterface, Sequelize);

  assert.deepEqual(created.map(([name]) => name), [
    "customers",
    "users",
    "loans",
    "installments",
    "payments",
    "employments",
    "sessions",
    "password_reset_tokens",
  ]);
  assert.equal(created.find(([name]) => name === "customers")[1].register_no.unique, true);
  assert.equal(created.find(([name]) => name === "loans")[1].loan_product.allowNull, false);
});

test("demo seed inserts one personal customer, loan, and three installments", async () => {
  const sql = [];
  const bulkInserts = [];
  const queryInterface = {
    sequelize: {
      query: async (statement) => {
        sql.push(statement);
        if (statement.includes("INSERT INTO customers")) return [[{ id: 10 }]];
        if (statement.includes("SELECT id FROM loans")) return [[]];
        if (statement.includes("INSERT INTO loans")) return [[{ id: 20 }]];
        return [[]];
      },
    },
    bulkInsert: async (table, rows) => bulkInserts.push([table, rows]),
  };

  await seed.up(queryInterface);

  assert(sql.some((statement) => statement.includes("INSERT INTO customers")));
  assert(sql.some((statement) => statement.includes("'personal'")));
  assert.equal(bulkInserts[0][0], "installments");
  assert.equal(bulkInserts[0][1].length, 3);
});
