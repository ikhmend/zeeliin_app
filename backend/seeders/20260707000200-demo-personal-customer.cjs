const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash("DemoPass123", 10);

    const [[customer]] = await queryInterface.sequelize.query(
      `INSERT INTO customers (register_no, customer_type, customer_code, last_name, first_name, phone, email, birth_date, current_address, official_address, created_at, updated_at)
       VALUES ('АА12345678', 'personal', 'CUST-DEMO-001', 'Demo', 'Customer', 99999999, 'demo.customer@example.com', '1995-01-15', 'Ulaanbaatar', 'Ulaanbaatar', :now, :now)
       ON CONFLICT (register_no) DO UPDATE SET updated_at = EXCLUDED.updated_at
       RETURNING id`,
      { replacements: { now } },
    );

    await queryInterface.sequelize.query(
      `INSERT INTO users (customer_id, username, full_name, email, phone, password_hash, role, is_active, created_at, updated_at)
       VALUES (:customerId, 'demo', 'Demo Customer', 'demo.customer@example.com', '99999999', :passwordHash, 'customer', true, :now, :now)
       ON CONFLICT (username) DO UPDATE SET customer_id = EXCLUDED.customer_id, updated_at = EXCLUDED.updated_at`,
      { replacements: { customerId: customer.id, passwordHash, now } },
    );

    const [existingLoans] = await queryInterface.sequelize.query(
      "SELECT id FROM loans WHERE loan_code = 'PL-DEMO-001' LIMIT 1",
    );
    const [[loan]] = existingLoans.length ? [existingLoans] : await queryInterface.sequelize.query(
      `INSERT INTO loans (loan_code, contract_no, account_no, customer_id, branch_id, loan_product, loan_status, loan_amount, loan_amount_currency, currency, interest_rate, fee_percent, fee_amount, duration_month, grace_period_month, previous_loan_balance, created_user_id, start_date, created_at, updated_at)
       VALUES ('PL-DEMO-001', 'CN-DEMO-001', '5000000001', :customerId, 1, 'personal', 'active', 3000000, 'MNT', 'MNT', 2.50, 1.00, 30000, 3, 0, 0, 1, '2026-07-01', :now, :now)
       RETURNING id`,
      { replacements: { customerId: customer.id, now } },
    );

    await queryInterface.sequelize.query(
      "DELETE FROM installments WHERE loan_id = :loanId AND installment_no IN (1, 2, 3)",
      { replacements: { loanId: loan.id } },
    );

    await queryInterface.bulkInsert("installments", [
      { loan_id: loan.id, installment_no: 1, due_date: "2026-08-01", principal_amount: 1000000, interest_amount: 75000, total_amount: 1075000, remaining_amount: 1075000, status: "pending", paid_amount: 0, created_at: now, updated_at: now },
      { loan_id: loan.id, installment_no: 2, due_date: "2026-09-01", principal_amount: 1000000, interest_amount: 50000, total_amount: 1050000, remaining_amount: 1050000, status: "pending", paid_amount: 0, created_at: now, updated_at: now },
      { loan_id: loan.id, installment_no: 3, due_date: "2026-10-01", principal_amount: 1000000, interest_amount: 25000, total_amount: 1025000, remaining_amount: 1025000, status: "pending", paid_amount: 0, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query("DELETE FROM installments WHERE loan_id IN (SELECT id FROM loans WHERE loan_code = 'PL-DEMO-001')");
    await queryInterface.sequelize.query("DELETE FROM loans WHERE loan_code = 'PL-DEMO-001'");
    await queryInterface.sequelize.query("DELETE FROM users WHERE username = 'demo'");
    await queryInterface.sequelize.query("DELETE FROM customers WHERE register_no = 'АА12345678'");
  },
};
