/*
- SCRIPT PARA REALIZAR PRUEBAS Y ESCENARIOS (NO ESTA LIGADO A LA API)
*/


require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Account = require('./models/account.model');
const User = require('./models/user.model');
const Card = require('./models/card.model');
const Movement = require('./models/transaction.model');

function generateRandomCardNumber() {
  return '4' + Math.random().toString().slice(2, 15).padEnd(15, '0');
}

function generateRandomCVV() {
  return Math.floor(100 + Math.random() * 900).toString();
}

async function createSampleMovements() {
  const accounts = await Account.find();

  for (const account of accounts) {
    const existing = await Movement.findOne({ fromAccount: account._id });
    if (existing) continue;

    const movements = [
      {
        type: 'deposit',
        amount: 2500,
        description: 'Depósito inicial',
      },
      {
        type: 'withdrawal',
        amount: 300,
        description: 'Compra supermercado',
      },
      {
        type: 'deposit',
        amount: 150,
        description: 'Pago cliente',
      }
    ];

    for (const mov of movements) {
      const movement = new Movement({
        fromAccount: account._id,
        type: mov.type,
        amount: mov.amount,
        description: mov.description,
        createdAt: new Date()
      });
      await movement.save();

      if (mov.type === 'deposit') {
        account.balance += mov.amount;
      } else if (mov.type === 'withdrawal') {
        account.balance -= mov.amount;
      }
    }

    await account.save();
  
  }
}

// - conectar base de datos
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Base de datos Conectada!'))
.then(async () => {
  // - Usuario 
  let user  = await User.findOne({ email: 'test2@gmail.com' });
  if (!user) {
    const hashedPassword = await bcrypt.hash('dmAnjUPeYN', 10);
    user = User.create({
      name: 'Fernando',
      email:  process.env.USER_EMAIL,
      password: hashedPassword
    });
  } 
  
  // - cuenta bancaria - 1  
  let existingAccount = await Account.findOne({ userId: user._id, accountNumber: '1234998765' });
  if (!existingAccount) {
    existingAccount = await Account.create({
      userId: user._id,
      accountNumber: '1234998765',
      balance: 9500,
      currency: 'GTQ'
    });
  }

  if(existingAccount) 
    {
     const existingCard = await Card.findOne({ userId: user._id, accountId: existingAccount._id });
      if(!existingCard)
      {
        await Card.create({
          userId: existingAccount.userId,
          accountId: existingAccount._id,
          cardNumber: generateRandomCardNumber(),
          cvv: generateRandomCVV(),
          expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 4)),
          type: 'debit'
        });
      }
  }


  await createSampleMovements();

})

.catch(err => console.error(err));

