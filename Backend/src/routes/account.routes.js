const express = require('express');
const router = express.Router();
const { getUserAccounts, getUserCards, getMovements } = require('../controllers/account.controller');
const { transferBetweenAccounts } = require('../controllers/transfer.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, getUserAccounts);
router.get('/cards', auth, getUserCards);
router.get('/:accountId/movements', auth, getMovements);
router.post('/transfer', auth, transferBetweenAccounts);

module.exports = router;