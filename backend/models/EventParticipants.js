'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

    class EventParticipants extends Model {

        static associate(models){
            EventParticipants.belongsTo(models.User, { foreignKey: 'userId' })
            EventParticipants.belongsTo(models.Event, { foreignKey: 'eventId' })
        }

    }
    
    EventParticipants.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Events', key: 'id' },
        },
        img_proof: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'EventParticipants'
    })

    return EventParticipants
}