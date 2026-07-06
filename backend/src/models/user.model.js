import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
const User= sequelize.define(
    "User", {
       id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
       },
       customer_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
       },
       username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
       },
       full_name:{
        type:DataTypes.STRING,
        allowNull: false,
       },
       email:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true,
       },
       phone:{
        type: DataTypes.STRING,
        allowNull:true,
        unique:true,
       },
       password_hash:{
        type:DataTypes.STRING,
        allowNull:false,
       },
       role:{
        type: DataTypes.STRING,
        allowNull:false,
       },
       is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
       },
    },
    {
        tableName:"users",
        timestamps:true,
        createdAt:"created_at",
        updatedAt:"updated_at",
    }
);
export default User;
