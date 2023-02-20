/** @format */
import express from "express";
import { readdirSync } from "fs";
import cors from "cors";
import mongoose from "mongoose";

const morgan = require("morgan");

require("dotenv").config();
// app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Database Connection

const DbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("### DATABASE CONNECTION ESTABLISTED ###");
  } catch (err) {
    console.log("Db Connectio Error", err);
  }
};

DbConnection();

// Routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
