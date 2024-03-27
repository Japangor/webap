const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const logger = require('../_helpers/logger');
const mailchimp = require('@mailchimp/mailchimp_transactional')(config.mailchimpApiKey);
const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub();

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  sendVerificationEmail,
  verifyEmail
};

async function authenticate({ username, password }) {
  const user = await db.User.scope('withHash').findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.hash))) {
    logger.error('Authentication failed: Username or password is incorrect');
    throw 'Username or password is incorrect';
  }

  if (!user.isVerified) {
    logger.error('Authentication failed: Email is not verified');
    throw 'Email is not verified';
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
  const user = await db.User.create(params);

  // publish message to Pub/Sub topic
  const topicName = 'user-registered';
  const data = JSON.stringify({
    userId: user.id,
    email: user.email
  });

  const dataBuffer = Buffer.from(data);
  await pubsub.topic(topicName).publish(dataBuffer);

  logger.info(`User registration message published to Pub/Sub topic: ${topicName}`);

  return omitHash(user.get());
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

async function sendVerificationEmail(user) {
  const verificationToken = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '2m' });
  const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

  const message = {
    from_email: config.fromEmail,
    subject: 'Verify Your Email',
    text: `Hello ${user.firstName},\n\nPlease verify your email by clicking the following link: ${verificationLink}\n\nThis link will expire in 2 minutes.\n\nBest regards,\nThe App Team`,
    html: `<p>Hello ${user.firstName},</p><p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p><p>This link will expire in 2 minutes.</p><p>Best regards,<br>The App Team</p>`,
    to: [
      {
        email: user.email,
        type: 'to'
      }
    ]
  };

  try {
    await mailchimp.messages.send({ message });
    logger.info(`Verification email sent to user with ID: ${user.id}`);
  } catch (error) {
    logger.error(`Error sending verification email to user with ID: ${user.id}`, error);
  }
}

async function verifyEmail(token) {
  try {
    const decoded = jwt.verify(token, config.secret);
    const userId = decoded.sub;

    const user = await db.User.findByPk(userId);
    if (!user) {
      logger.error(`User not found with ID: ${userId}`);
      throw 'User not found';
    }

    user.isVerified = true;
    await user.save();

    logger.info(`Email verified for user with ID: ${userId}`);
  } catch (error) {
    logger.error('Error verifying email:', error);
    throw 'Invalid or expired verification token';
  }
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