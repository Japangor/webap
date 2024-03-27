const config = require('./config.json');
const jwt = require('jsonwebtoken');
const mailchimp = require('@mailchimp/mailchimp_transactional')(config.mailchimpApiKey);
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const EmailVerification = sequelize.define('EmailVerification', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  sentAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

exports.sendVerificationEmail = async (event, context) => {
  const pubsubMessage = Buffer.from(event.data, 'base64').toString();
  const { userId, email } = JSON.parse(pubsubMessage);

  try {
    const verificationToken = jwt.sign({ userId }, config.secret, { expiresIn: '2m' });
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

    const message = {
      from_email: config.fromEmail,
      subject: 'Verify Your Email',
      text: `Hello,\n\nPlease verify your email by clicking the following link: ${verificationLink}\n\nThis link will expire in 2 minutes.\n\nBest regards,\nThe App Team`,
      html: `<p>Hello,</p><p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p><p>This link will expire in 2 minutes.</p><p>Best regards,<br>The App Team</p>`,
      to: [
        {
          email: email,
          type: 'to'
        }
      ]
    };

    await mailchimp.messages.send({ message });

    await EmailVerification.create({
      userId: userId
    });

    console.log(`Verification email sent to user with ID: ${userId}`);
  } catch (error) {
    console.error(`Error sending verification email to user with ID: ${userId}`, error);
  }
};