// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../db');
// const UserPhotos = require('./UserPhotos')
// const Event = require('./Event')
// const EventParticipants = require('./EventParticipants')

// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     face_data: {
//         type: DataTypes.ARRAY(DataTypes.FLOAT),
//         allowNull: true, 
//     },
// }, {
//     timestamps: true,
// });

// User.associate = (models) => {
//     User.hasMany(UserPhotos, {
//         foreignKey: 'userId', 
//     });
//     User.hasMany(Event, {
//         foreignKey: 'creatorId',
//     });
//     User.belongsToMany(Event, {
//         through: EventParticipants,
//         foreignKey: 'userId',
//         otherKey: 'eventId',
//     });
// };

// module.exports = User;


'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

    class User extends Model {

        static associate(models){
            this.hasMany(models.UserPhotos, { foreignKey: 'userId' })
            this.hasMany(models.Event, { foreignKey: 'creatorId' })
            this.hasMany(models.EventParticipants, { foreignKey: 'userId' })
        }

    }
    
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        face_data: {
            type: DataTypes.ARRAY(DataTypes.FLOAT),
            allowNull: true, 
        },
    }, {
        sequelize,
        modelName: 'User'
    })

    return User
}