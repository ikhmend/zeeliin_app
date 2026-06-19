import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
const Loan = sequelize.define(
  "Loan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    loan_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contract_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loan_product: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loan_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loan_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    loan_amount_currency: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    fee_percent: {
      type: DataTypes.DECIMAL(5, 2),
    },
    fee_amount: {
      type: DataTypes.DECIMAL(15, 2),
    },
    duration_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    grace_period_month: {
      type: DataTypes.INTEGER,
    },
    previous_loan_balance: {
      type: DataTypes.DECIMAL(15, 2),
    },
    created_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_user_id: {
      type: DataTypes.INTEGER,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "loans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
export default Loan;