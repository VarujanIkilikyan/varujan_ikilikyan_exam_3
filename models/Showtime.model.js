// 3. **showtimes**
// - id — PK, AUTO_INCREMENT
// - film_id — FK → films.id
// - show_date — DATE
// - show_time — TIME
// - price — DECIMAL
// - total_seats — INT (e.g. 50)
// - available_seats — INT
// - created_at — DATETIME

import DbConnection from "../config/database.js";
import {Model, DataTypes} from 'sequelize';
import FilmsModel from "./Films.model.js";
import BookingModel from "./Booking.model.js";


class Showtime  extends Model {
    static associate() {
        this.belongsTo(FilmsModel, { foreignKey: 'filmid', as: 'film' });
        FilmsModel.hasMany(this, { foreignKey: 'filmid', as: 'showtimes' });

        // this.hasMany(BookingModel, { foreignKey: 'showtimeid', as: 'bookings' });
    }
}

Showtime.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    filmid:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'films',
            key: 'id'
        }
    },
    showdate:{
        type:DataTypes.DATE,
        allowNull: false,

    },
    showtime:{
        type:DataTypes.TIME,
        allowNull: false,
    },
    price:{
        type:DataTypes.DECIMAL,
        allowNull: false,
    },
    totalseats:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    availableseats:{
        type:DataTypes.INTEGER,
        allowNull: false,
    }

},{
    sequelize: DbConnection,
    modelName: 'showtime',
    tableName: 'showtime',
    timestamps: true,
    freezeTableName: true,});

Showtime.associate();

export default Showtime;