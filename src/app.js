const app = require("express")();
const dotenv = require("dotenv");
const connectDb = require("./config/db");

const PORT = 3000;

// Load dotenv config
dotenv.config();

connectDb();

app.listen(PORT, console.log("Listening at port 3000"));
