import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
const Payment=sequelize.define(
    "Payment", {
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
        },
        loan_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        installment_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        payment_amount:{
            type:DataTypes.DECIMAL(15, 2),
            allowNull:false,
        },
        payment_date:{
            type:DataTypes.DATEONLY,
            allowNull:false,
        },
        payment_method:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        received_user_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        note:{
            type:DataTypes.TEXT,
            allowNull:true,
        },
    },
    {
        tableName: "payments",
        timestamps:true,
        createdAt:"created_at",
        updatedAt:"updated_at",
    }
);
export default Payment;