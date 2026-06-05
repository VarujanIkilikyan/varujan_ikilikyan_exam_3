// 4. **bookings**
// - id — PK, AUTO_INCREMENT
// - user_id — FK → users.id
// - showtime_id — FK → showtimes.id
// - seats — VARCHAR (e.g. "A1,A2,A3")
// - total_price — DECIMAL
// - booking_reference — VARCHAR, UNIQUE (from uuid)
// - booking_date — DATETIME
// - status — ENUM('confirmed', 'cancelled')

import DbConnection from "../config/database.js";
import {Model, DataTypes} from 'sequelize';
import UsersModel from "./Users.model.js";
import ShowtimeModel from "./Showtime.model.js"

class Booking extends Model {
    static associate() {

        // this.belongsTo(UsersModel, { foreignKey: 'userid', as: 'users' });
        // this.belongsTo(ShowtimeModel, { foreignKey: 'showtimeid', as: 'showtime' });

        // this.belongsTo(UsersModel, { foreignKey: 'userid ', as: 'users' });
        // UsersModel.hasMany(this, { foreignKey: 'userid', as: 'booking' });
        // ShowtimeModel.hasOne(Booking, { foreignKey: 'showtimeid', as: 'booking' });
        // this.belongsTo(ShowtimeModel, { foreignKey: 'showtimeid', as: 'showtime' });
    }
}

Booking.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userid:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    showtimeid :{
        type:DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'showtime',
            key: 'id'
        }
    },
    seats:{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    totalprice:{
        type:DataTypes.DECIMAL,
        allowNull: false,
    },
    bookingreference:{
        type:DataTypes.UUID

    },
    status:{
        type:DataTypes.ENUM('confirmed','cancelled'),
        allowNull: false,
    },



},{
    sequelize: DbConnection,
    modelName: 'booking',
    tableName: 'booking',
    timestamps: true,
    freezeTableName: true,
})
Booking.associate();
export default Booking;