const config = require('config.json');
const jwt = require('jsonwebtoken');
const mailchimp = require('@mailchimp/mailchimp_transactional')(config.mailchimpApiKey);
const logger = require('../_helpers/logger');

module.exports = async function sendVerificationEmail(user) {
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
};