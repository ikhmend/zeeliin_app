import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
const Installment = sequelize.define(
  "Installment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    installment_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    principal_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    interest_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    remaining_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },

    paid_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    paid_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },
  },
  {
    tableName: "installments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
export default Installment;
