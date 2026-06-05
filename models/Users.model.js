import DbConnection from "../config/database.js";
import {Model, DataTypes} from 'sequelize';
import bcrypt from "bcrypt";
import BookingModel from "./Booking.model.js";

class Users extends Model {
    static associate() {
    // this.hasMany(BookingModel, { foreignKey: 'userid', as: 'bookings' });
    }
}

// - id — PK, AUTO_INCREMENT
// - username — VARCHAR, UNIQUE
// - email — VARCHAR, UNIQUE
// - password — VARCHAR (MD5 digest)
// - full_name — VARCHAR
// - role — ENUM('user', 'admin')
// - created_at — DATETIME

Users.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                is: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            set(password) {
                const hashedPassword = bcrypt.hashSync(password, 10);
                this.setDataValue('password', hashedPassword);
            },
            get() {
                return undefined;
            }
        },
        fullname:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role:{
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }


    },
    {
        sequelize: DbConnection,
        modelName: 'users',
        tableName: 'users',
        timestamps: true,
        freezeTableName: true,
    }
);
export default Users;