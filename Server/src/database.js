const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/payfren")
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 15,
    unique: true,
    trim: true,
    lowerCase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 100,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 15,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 15,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    require: true,
  },
});

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  Account,
};
