// - id — PK, AUTO_INCREMENT
// - title — VARCHAR
// - description — TEXT
// - genre — VARCHAR (e.g. Action, Comedy, Drama, Horror, Sci-Fi)
// - duration — INT (minutes)
// - created_at — DATETIME

import DbConnection from "../config/database.js";
import {Model, DataTypes} from 'sequelize';

class Films extends Model {
}

Films.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT(),
        allowNull: false,
    },
    genre:{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []

    },
    duration:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }

},{
    sequelize: DbConnection,
    modelName: 'films',
    tableName: 'films',
    timestamps: true,
    freezeTableName: true,
})

export default Films;