/** @format */

import express from "express";

//controller
import { register, login } from "../controllers/auth";

const router = express.Router();

// User Routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;
