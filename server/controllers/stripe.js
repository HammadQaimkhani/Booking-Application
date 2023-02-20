import User from "../model/User";
import Hotel from "../model/hotel";
import Order from "../model/order";
import Stripe from "stripe";
import queryString from "query-string";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
  // Find the User from Db
  const user = await User.findById(req.user._id).exec();

  // if User dont have stripe_account_seller_id yet, create now
  if (!user.stripe_account_id);
  {
    const account = await stripe.accounts.create({
      type: "express",
    });
    user.stripe_account_id = account.id;
    user.save();
  }

  // create  account link based on account id ( for frontend to complete onboarding)
  let accountLink = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: "account_onboarding",
  });

  // pre fill any info such as email

  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email || undefined,
  });

  res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
};
// update payment schedule (optional default is 2 days)
const updateDelayDays = async (accountId) => {
  const account = await stripe.accounts.update(accountId, {
    settings: {
      payouts: {
        schedule: {
          delay_days: 7,
        },
      },
    },
  });
  return account;
};

export const getAccountStatus = async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  const account = await stripe.accounts.retrieve(user.stripe_account_id);
  const updatedAccount = await updateDelayDays(account.id);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      stripe_seller: updatedAccount,
    },
    { new: true }
  )
    .select(`-password`)
    .exec();

  res.json(updatedUser);
};

export const getAccountBalance = async (req, res) => {
  const user = await User.findById(req.user._id).exec();

  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    res.json(balance);
  } catch (err) {
    console.log(err);
  }
};

export const payoutSetting = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();

    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_account_id,
      { redirect_url: process.env.STRIPE_REDIRECT_LOGIN_LINK }
    );

    res.json(loginLink);
  } catch (err) {
    console.log("Payout Err", err);
  }
};

export const stripeSessionId = async (req, res) => {
  //console.log(req.body.hotelId);
  // 1. get hotel id from req.body
  const { hotelId } = req.body;
  // 2. find the hotel based on hotel id from db
  const item = await Hotel.findById(hotelId).populate("postedBy").exec();
  // 3. 20% charges as application fee
  const fee = (item.price * 20) / 100;

  // 4. create session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // 5. purchasing item details, it will be shown to user on checkout
    line_items: [
      {
        name: item.title,
        amount: item.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
    // 6 . create payment intent with application fee and destination charges 80%
    payment_intent_data: {
      application_fee_amount: fee * 100,
      // this seller can see his balance in out frontend dashboard
      transfer_data: {
        destination: item.postedBy.stripe_account_id,
      },
    },

    success_url: `${process.env.STRIPE_SUCCESS_URL}/${item._id}`,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });
  // 7 . add this session object to user in the db
  await User.findByIdAndUpdate(req.user._id, { stripeSession: session }).exec();

  // 8 . send session id as response to frontend
  res.send({
    sessionId: session.id,
  });
};

export const stripeSuccess = async (req, res) => {
  try {
    // 1 get hotel id from req.body
    const { hotelId } = req.body;
    // 2 find currently logged in user
    const user = await User.findById(req.user._id).exec();

    if (!user.stripeSession) return;

    // 3 retrieve stripe session, based on session id we previously save in user db
    const session = await stripe.checkout.sessions.retrieve(
      user.stripeSession.id
    );
    // 4 if session payment status is paid, create order
    if (session.payment_status === "paid") {
      // 5 check if order with that session id already exist by querying orders collection
      const orderExist = await Order.findOne({
        "session.id": session.id,
      }).exec();
      if (orderExist) {
        // 6 if order exist, send success true
        res.json({ success: true });
      } else {
        // 7 else create new order and send success true
        let newOrder = await new Order({
          hotel: hotelId,
          session,
          orderedBy: user._id,
        }).save();
        // 8 remove user's stripeSession
        await User.findByIdAndUpdate(user._id, {
          $set: { stripeSession: {} },
        });
        res.json({ success: true });
      }
    }
  } catch (err) {
    console.log("STRIPE SUCCESS ERR", err);
  }
};
