const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");

const bodyParser = require("body-parser");
const app = express();
const user = require("./user/user");

// middlewares
app.use(bodyParser.json());

// routing
app.use("/user", user);

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// suppress the warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
// connect to db
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log("connected to DB!");
});

// listening on port 8000
app.listen(8000);
