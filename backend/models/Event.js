// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../db');
// const User = require('./UserPhotos')
// const EventParticipants = require('./EventParticipants')

// const Event = sequelize.define('Event', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     start_time: {
//         type: DataTypes.DATE,
//         allowNull: false,
//     },
//     end_time: {
//         type: DataTypes.DATE,
//         allowNull: false,
//     },
//     location: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: true, 
//     },
//     creatorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: { model: 'User', key: 'id' },
//     },
// }, {
//     timestamps: true,
// });

// Event.associate = (models) => {
//     Event.belongsTo(User, {
//         foreignKey: 'creatorId',
//     });
//     Event.belongsToMany(User, {
//         through: EventParticipants,
//         foreignKey: 'eventId',
//         otherKey: 'userId',
//     });
// };

// module.exports = Event;

'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

    class Event extends Model {

        static associate(models){
            this.belongsTo(models.User, { foreignKey: 'creatorId' });
            this.hasMany(models.EventParticipants, { foreignKey: 'eventId' })
        }

    }
    
    Event.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true, 
        },
        creatorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'User', key: 'id' },
        },
    }, {
        sequelize,
        modelName: 'Event'
    })

    return Event
}