import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

/**
 * DB Setup
 */

// move it to a config file
const mongodbConnectionUrl = 'mongodb://localhost:27017';

const Schema = mongoose.Schema;
const DonationSchema = new Schema({
  amount: Number,
  currency: String,
  date: Date,
});

const DonationModel = mongoose.model('donations', DonationSchema);

async function setupDB() {
  await mongoose.connect(mongodbConnectionUrl);
}

/**
 * Donate function
 */

async function donate(amount: number, currency: string) {
  const acceptedCurrencies = ['USD', 'EUR', 'GBP', 'RUB'];

  if (acceptedCurrencies.indexOf(currency) < 0) {
    throw 'Wrong currency';
  }

  if (amount <= 0) {
    throw 'Amount must be bigger then 0';
  }

  const record = new DonationModel();

  record.amount = amount;
  record.currency = currency;
  record.date = new Date();

  await record.save();
}

/**
 * Express setup
 */

async function POSTdonate(req: Request) {
  if (
    typeof req.body.amount === 'number' &&
    typeof req.body.currency === 'string'
  ) {
    return await donate(req.body.amount, req.body.currency);
  } else {
    throw 'Incorrect request format';
  }
}

async function handle(
  func: (req: Request) => void,
  req: Request,
  res: Response
) {
  try {
    await func(req);
    res.json({
      ok: true,
    });
  } catch (error) {
    res.json({
      ok: false,
      error: typeof error === 'string' ? error : 'Internal Error',
    });
  }
}

async function setupApp() {
  await setupDB();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({}));

  app.post('/donate', (req, res) => {
    handle(POSTdonate, req, res);
  });

  app.use('/', express.static('../client/dist'));

  app.listen(8081);
  console.log('Server is listing on port 8081');
}

setupApp();
