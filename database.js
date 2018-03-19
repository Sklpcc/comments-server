import Sequelize from 'sequelize';

const {DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_DIALECT, DB_PORT} = process.env;

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
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
