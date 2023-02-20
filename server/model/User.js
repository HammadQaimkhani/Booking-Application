import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is Required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is Required",
      unique: true,
    },
    password: {
      type: String,
      required: "Password is Required",
      min: 6,
      max: 64,
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
  },
  {
    timestamps: true,
  }
);

// For Hashing Password in Database

userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    return bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        console.log("Bcrypt Error", err);
        next(err);
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

// Compare Password for login

userSchema.methods.camparePassowrd = function (password, next) {
  let user = this;
  bcrypt.compare(password, user.password, function (err, match) {
    if (err) {
      return next(err, false);
    }
    // null if password match
    return next(null, match);
  });
};

export default mongoose.model("User", userSchema);
