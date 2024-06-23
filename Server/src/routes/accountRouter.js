const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../database");
const { default: mongoose } = require("mongoose");

const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });
  console.log(account);
  return res.status(200).json({ balance: account.balance });
});

accountRouter.post("/transaction", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, receipient } = req.body;

  const account = await Account.findOne({
    userId: req.userId,
  });

  if (account.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const receipientAccount = await Account.findOne({
    userId: receipient,
  });

  if (!receipientAccount) {
    return res.status(411).json({ message: "Invalid account" });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  );

  await Account.updateOne(
    {
      userId: receipientAccount,
    },
    {
      $inc: {
        balance: +amount,
      },
    }
  );

  session.commitTransaction();

  res.status(200).json({ message: "Transaction successfull" });
});

module.exports = accountRouter;
