module.exports = (sequelize, Sequelize)=>{
    const Services = sequelize.define('services', {
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        detail: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        image_url: {
            type: Sequelize.STRING,
            allowNull: true
        },
        tag: {
            type: Sequelize.STRING,
            allowNull: true
        },
    });
    return Services;
}