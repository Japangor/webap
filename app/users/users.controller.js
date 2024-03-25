const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const userService = require('./user.service');
const logger = require('../_helpers/logger');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  userService.authenticate(req.body)
    .then(user => {
      logger.info('User authenticated successfully');
      res.json(user);
    })
    .catch(err => {
      logger.error('Error authenticating user:', err);
      next(err);
    });
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required()
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  userService.create(req.body)
    .then(() => {
      logger.info('User registered successfully');
      res.json({ message: 'Registration successful' });
    })
    .catch(err => {
      logger.error('Error registering user:', err);
      next(err);
    });
}

function getAll(req, res, next) {
  userService.getAll()
    .then(users => {
      logger.info('Retrieved all users');
      res.json(users);
    })
    .catch(err => {
      logger.error('Error retrieving users:', err);
      next(err);
    });
}

function getCurrent(req, res, next) {
  logger.info('Retrieved current user');
  res.json(req.user);
}

function getById(req, res, next) {
  userService.getById(req.params.id)
    .then(user => {
      logger.info('Retrieved user by ID:', req.params.id);
      res.json(user);
    })
    .catch(err => {
      logger.error('Error retrieving user by ID:', err);
      next(err);
    });
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    username: Joi.string().empty(''),
    password: Joi.string().min(6).empty('')
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  userService.update(req.params.id, req.body)
    .then(user => {
      logger.info('Updated user:', req.params.id);
      res.json(user);
    })
    .catch(err => {
      logger.error('Error updating user:', err);
      next(err);
    });
}

function _delete(req, res, next) {
  userService.delete(req.params.id)
    .then(() => {
      logger.info('Deleted user:', req.params.id);
      res.json({ message: 'User deleted successfully' });
    })
    .catch(err => {
      logger.error('Error deleting user:', err);
      next(err);
    });
}