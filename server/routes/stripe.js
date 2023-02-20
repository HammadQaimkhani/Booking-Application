/** @format */

import express from "express";

//Middleware
import { requireSignin } from "../middlewares";

//controller
import {
  createConnectAccount,
  getAccountStatus,
  getAccountBalance,
  payoutSetting,
  stripeSessionId,
  stripeSuccess,
} from "../controllers/stripe";

const router = express.Router();

// User Routes
router.post("/create-connect-account", requireSignin, createConnectAccount);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.post("/get-account-balance", requireSignin, getAccountBalance);
router.post("/payout-setting", requireSignin, payoutSetting);
router.post("/stripe-session-id", requireSignin, stripeSessionId);

// order
router.post("/stripe-success", requireSignin, stripeSuccess);

module.exports = router;
