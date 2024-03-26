const config = require('config.json');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
  const { host, port, user, password, database } = config.database;

  // connect to db
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  });
  

  // init models and add them to the exported db object
  db.User = require('../users/user.model')(sequelize);

  // sync all models with database
  await sequelize.sync();
}