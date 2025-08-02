const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, validateToken } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], login);

router.get('/validate-token', auth, validateToken);

module.exports = router;