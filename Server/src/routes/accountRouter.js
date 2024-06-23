const express = require("express");
const { authMiddleware } = require("../middleware");
const { User, Account } = require("../database");
const { default: mongoose } = require("mongoose");

const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });
  return res.status(200).json({ balance: account.balance });
});

accountRouter.post("/transaction", authMiddleware, async (req, res) => {
  console.log("Received request for transaction");
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, recipient } = req.body;

  console.log(req.userId + " " + req.body.amount + " " + req.body.recipient);

  const account = await Account.findOne({
    userId: req.userId,
  });

  if (account.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const recipientAccountDetails = await User.findOne({
    userName: recipient,
  });

  const recipientAccount = await Account.findOne({
    userId: recipientAccountDetails._id,
  });

  if (!recipientAccount) {
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
      userId: recipientAccount,
    },
    {
      $inc: {
        balance: +amount,
      },
    }
  );

  session.commitTransaction();
  console.log("Transaction completed successfully");
  res.status(200).json({ message: "Transaction successfull" });
});

module.exports = accountRouter;
