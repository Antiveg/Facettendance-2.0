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