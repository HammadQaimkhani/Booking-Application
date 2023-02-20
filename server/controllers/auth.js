/** @format */
import User from "../model/User";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).send("Name is Required");
    if (!password) return res.status(400).send("Password is Required");
    if (password.length < 6)
      return res
        .status(400)
        .send("Password Should be Greater than 6 Character");

    const existedUser = await User.findOne({ email }).exec();

    if (existedUser) return res.status(400).send("Email Already Taken");

    const user = new User(req.body);
    await user.save();
    console.log("User is Registered");
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error Try Again");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check that user with that email is exist or not
  try {
    let user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(400).send("No User Found on This Email Please Sign Up");
    }

    user.camparePassowrd(password, (err, match) => {
      if (!match || err) {
        return res.status(400).send("Wrong Password");
      }

      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.stripe_account_id,
          stripe_seller: user.stripe_seller,
          stripeSession: user.stripeSession,
        },
      });
    });
  } catch (err) {
    res.status(400).send("Login Failed Try Again");
  }
};
