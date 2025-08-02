const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  cardNumber: { type: String, unique: true },
  cvv: String,
  expiresAt: Date,
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  type: { type: String, enum: ['debit', 'credit'], default: 'debit' }
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);