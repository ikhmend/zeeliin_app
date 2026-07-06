import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
const Employment = sequelize.define(
  "Employment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    organization_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    worked_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    monthly_salary: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },

    organization_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "employments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
export default Employment;