const config = require('config.json');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
  const { host, port, user, password, database } = config.database;

  // connect to db
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  });

  // init models and add them to the exported db object
  db.User = require('../users/user.model')(sequelize);

  // sync all models with database
  await sequelize.sync({ alter: true });
}