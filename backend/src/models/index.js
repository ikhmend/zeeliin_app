import sequelize from "../config/sequelize.js";
import Loan from "./loan.model.js";
import Installment from "./installments.model.js";
import Payment from "./payments.model.js";
import User from "./user.model.js";
import Customer from "./customer.model.js";
import Employment from "./employments.model.js";
import PasswordReset from "./password.reset.model.js";
Loan.hasMany(Installment, {
  foreignKey: "loan_id",
  as: "installments",
});
Installment.belongsTo(Loan, {
  foreignKey: "loan_id",
  as: "loan",
});
Customer.hasOne(Employment, {
  foreignKey: "customer_id",
  as: "employment",
});

Employment.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});
Loan.hasMany(Payment, {
  foreignKey: "loan_id",
  as: "payments",
});

Payment.belongsTo(Loan, {
  foreignKey: "loan_id",
  as: "loan",
});
Customer.hasOne(User, {
  foreignKey: "customer_id",
  as: "user",
});

User.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});
PasswordReset.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
User.hasMany(PasswordReset, {
  foreignKey: "user_id",
  as:"passwordReset",
});
export {sequelize, Loan, Installment, Payment, User, Customer,Employment, PasswordReset};