import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
const PasswordReset= sequelize.define(
    "PasswordReset",
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"users",
                key:"id",
            },
            onDelete:"CASCADE",
            onUpdate:"CASCADE",
        },
        token_hash:{
            type:DataTypes.STRING(64),
            allowNull: false,
            unique:true
        },
        expires_at:{
            type: DataTypes.DATE,
            allowNull:false,
        },
        used_at:{
            type:DataTypes.DATE,
            allowNull:true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },{
        tableName:"password_reset_tokens",
        timestamps:false,
         indexes:[
            {
                fields:["user_id"],
            },
            {
                fields:["token_hash"],
                unique:true,
            },
            {
                fields:["expires_at"],
            },
         ],
    },
)
export default PasswordReset;