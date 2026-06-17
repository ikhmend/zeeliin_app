'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
import sequelize from "../config/sequelize.js";
import Loan from "./loan.model.js";
import Installment from "./installment.model.js";
import User from "./user.model.js";
import Customer from "./customer.model.js";
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
  foreignKey:"loan_id",
  as:"payments"
});
Payment.belongsTo(Loan, {
  foreignKey: "loan_id",
  as:"loan"
})
export { sequelize, Loan, Installment };
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
