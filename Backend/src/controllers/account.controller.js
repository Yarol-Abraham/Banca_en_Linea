const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');
const Card = require('../models/card.model');
const User = require('../models/user.model');

exports.getUserAccounts = async (req, res) => {
    try {
    const accounts = await Account.find({ userId: req.user.id });
    
    console.log("usuario", req.user);
    console.log("cuentas", accounts);

    res.status(200).json({
      status: true,
      message: "success",
      data: accounts.map(account => ({
          id: account._id,
          accountNumber: account.accountNumber,
          balance: account.balance,
          currency: account.currency,
          createdAt: account.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error......', data: null });
  }
};

exports.getUserCards = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user.id }).populate('userId', 'name');

    res.status(200).json({
      status: true,
      message: "Tarjetas Obtenidas",
      data: cards.map(card => ({
            id: card._id,
            userName:  card.userId.name,
            cardNumber: card.cardNumber,
            accountId: card.accountId,
            type: card.type,
            status: card.status,
            expiresAt: card.expiresAt
          }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error......', data: null });
  }
};


exports.getMovements = async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findById(accountId);
  if (!account || account.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'No autorizado', data: null });
  }

  const transactions = await Transaction.find({
    $or: [
      { fromAccount: accountId },
      { toAccount: accountId }
    ]
  }).sort({ timestamp: -1 });

  res.status(200).json({ 
    success: true,
    message: "success",
    data: transactions
  });
};