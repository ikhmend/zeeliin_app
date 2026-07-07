module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("customers", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      register_no: { type: Sequelize.STRING, allowNull: false, unique: true },
      customer_type: Sequelize.STRING,
      customer_code: Sequelize.STRING,
      family_name: Sequelize.STRING,
      last_name: { type: Sequelize.STRING, allowNull: false },
      first_name: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.INTEGER, allowNull: false },
      home_phone: Sequelize.INTEGER,
      email: Sequelize.STRING,
      social: Sequelize.STRING,
      activity_dir: Sequelize.STRING,
      business_type: Sequelize.STRING,
      education: Sequelize.STRING,
      profession: Sequelize.STRING,
      birth_date: { type: Sequelize.DATE, allowNull: false },
      birth_place: Sequelize.STRING,
      official_address: Sequelize.STRING,
      current_address: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      customer_id: {
        type: Sequelize.INTEGER,
        references: { model: "customers", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      full_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true },
      phone: { type: Sequelize.STRING, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("loans", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      loan_code: { type: Sequelize.STRING, allowNull: false },
      contract_no: { type: Sequelize.STRING, allowNull: false },
      account_no: { type: Sequelize.STRING, allowNull: false },
      customer_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "customers", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      branch_id: { type: Sequelize.INTEGER, allowNull: false },
      loan_product: { type: Sequelize.STRING, allowNull: false },
      loan_status: { type: Sequelize.STRING, allowNull: false },
      loan_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      loan_amount_currency: Sequelize.STRING,
      currency: Sequelize.STRING,
      interest_rate: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
      fee_percent: Sequelize.DECIMAL(5, 2),
      fee_amount: Sequelize.DECIMAL(15, 2),
      duration_month: { type: Sequelize.INTEGER, allowNull: false },
      grace_period_month: Sequelize.INTEGER,
      previous_loan_balance: Sequelize.DECIMAL(15, 2),
      created_user_id: { type: Sequelize.INTEGER, allowNull: false },
      updated_user_id: Sequelize.INTEGER,
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("installments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      loan_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "loans", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      installment_no: { type: Sequelize.INTEGER, allowNull: false },
      due_date: { type: Sequelize.DATEONLY, allowNull: false },
      principal_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      interest_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      total_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      remaining_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: "pending" },
      paid_date: Sequelize.DATEONLY,
      paid_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("payments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      loan_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "loans", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      installment_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "installments", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      payment_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      payment_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      payment_method: { type: Sequelize.STRING, allowNull: false },
      received_user_id: Sequelize.INTEGER,
      note: Sequelize.TEXT,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("employments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      customer_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "customers", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      organization_name: Sequelize.STRING(255),
      position: Sequelize.STRING(100),
      worked_year: Sequelize.INTEGER,
      monthly_salary: Sequelize.DECIMAL(18, 2),
      organization_address: Sequelize.TEXT,
      phone: { type: Sequelize.STRING(20), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("sessions", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      token_hash: { type: Sequelize.STRING(64), allowNull: false, unique: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      revoked_at: Sequelize.DATE,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("password_reset_tokens", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      token_hash: { type: Sequelize.STRING(64), allowNull: false, unique: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      used_at: Sequelize.DATE,
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface) {
    for (const table of ["password_reset_tokens", "sessions", "employments", "payments", "installments", "loans", "users", "customers"]) {
      await queryInterface.dropTable(table);
    }
  },
};
