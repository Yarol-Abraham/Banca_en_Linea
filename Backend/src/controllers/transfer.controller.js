const Account = require('../models/account.model');
const Movement = require('../models/transaction.model');

exports.transferBetweenAccounts = async (req, res) => {
  const { fromAccountNumber, toAccountNumber, amount, description } = req.body;

  if (!fromAccountNumber || !toAccountNumber || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Datos inválidos para la transferencia.' });
  }

  try {
    const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ message: 'Una o ambas cuentas no existen.' });
    }

    if (String(fromAccount.userId) !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para transferir desde esta cuenta.' });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: 'Fondos insuficientes.' });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    const fromMovement = new Movement({
      fromAccount: fromAccount._id,
      type: 'transfer',
      amount,
      description: description || `Transferencia a ${toAccount.accountNumber}`
    });

    const toMovement = new Movement({
      fromAccount: toAccount._id,
      type: 'deposit',
      amount,
      description: description || `Transferencia recibida de ${fromAccount.accountNumber}`
    });

    await fromMovement.save();
    await toMovement.save();

    res.status(200).json({ status: true, message: 'Transferencia realizada con éxito.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Error al procesar la transferencia.' });
  }
};
