module.exports = (sequelize, Sequelize)=> {
    const User = sequelize.define('users', {
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

    });
    return User;
}