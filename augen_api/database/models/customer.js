'use strict';
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('Customer', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return User;
}
