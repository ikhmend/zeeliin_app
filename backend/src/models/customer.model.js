import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
const Customer= sequelize.define(
    "Customer",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        register_no:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        customer_type:{
            type:DataTypes.STRING,
            allowNull: true,
        },
        customer_code:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        family_name:{
            type:DataTypes.STRING,
            allowNull: true,
        },
        last_name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        first_name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        phone:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        home_phone:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        social:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        activity_dir:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        business_type:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        education:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        profession:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        birth_date:{
            type:DataTypes.DATE,
            allowNull:false,
        },
        birth_place:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        official_address:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        current_address:{
            type:DataTypes.STRING,
            allowNull:true,
        },
    },
    {
        tableName:"customers",
        timestamps:true,
        createdAt:"created_at",
        updatedAt: "updated_at",
    }
);
export default Customer;