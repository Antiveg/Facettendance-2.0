'use strict'
const { Model, Sequelize } = require('sequelize')
module.exports = (sequelize, DataTypes) => {

    class UserPhotos extends Model {

        static associate(models){
            this.belongsTo(models.User, { foreignKey: 'userId' })
        }

    }
    
    UserPhotos.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
            primaryKey: true,
        },
        photo_url: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
    }, {
        sequelize,
        modelName: 'UserPhotos'
    })

    return UserPhotos
}