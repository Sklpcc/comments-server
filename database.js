import Sequelize from 'sequelize';

const connection = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: 'database.sqlite',
    operatorsAliases: false,
});

connection.define('comment', {
    content: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

//noinspection JSIgnoredPromiseFromCall
connection.sync({force: false});

export default connection;
