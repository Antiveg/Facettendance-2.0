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