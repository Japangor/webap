const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const logger = require('../_helpers/logger');
const mailchimp = require('@mailchimp/mailchimp_transactional')(config.mailchimpApiKey);

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function authenticate({ username, password }) {
  const user = await db.User.scope('withHash').findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.hash))) {
    logger.error('Authentication failed: Username or password is incorrect');
    throw 'Username or password is incorrect';
  }

  // authentication successful
  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
  logger.info('User authenticated successfully');
  return { ...omitHash(user.get()), token };
}

async function getAll() {
  logger.info('Retrieving all users');
  return await db.User.findAll();
}

async function getById(id) {
  logger.info(`Retrieving user by ID: ${id}`);
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    logger.error(`Username "${params.username}" is already taken`);
    throw `Username "${params.username}" is already taken`;
  }

  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  logger.info('Creating new user');
  await db.User.create(params);
  const user = await db.User.create(params);

  // send welcome email
  const message = {
    from_email: config.fromEmail,
    subject: 'Welcome to Our App',
    text: `Hello ${user.firstName},\n\nWelcome to our app! Your registration was successful.\n\nBest regards,\nThe App Team`,
    html: `<p>Hello ${user.firstName},</p><p>Welcome to our app! Your registration was successful.</p><p>Best regards,<br>The App Team</p>`,
    to: [
      {
        email: user.email,
        type: 'to'
      }
    ]
  };

  try {
    await mailchimp.messages.send({ message });
    logger.info(`Welcome email sent to user with ID: ${user.id}`);
  } catch (error) {
    logger.error(`Error sending welcome email to user with ID: ${user.id}`, error);
  }

}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
    logger.error(`Username "${params.username}" is already taken`);
    throw `Username "${params.username}" is already taken`;
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  logger.info(`Updating user with ID: ${id}`);
  await user.save();
  return omitHash(user.get());
}

async function _delete(id) {
  const user = await getUser(id);
  logger.info(`Deleting user with ID: ${id}`);
  await user.destroy();
}

// helper functions
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) {
    logger.error(`User not found with ID: ${id}`);
    throw 'User not found';
  }
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}