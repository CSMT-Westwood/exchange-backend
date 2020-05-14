const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const bodyParser = require("body-parser");
const app = express();
const user = require("./user/user");
const post = require("./post/post");

// middlewares
app.use(bodyParser.json());
app.use(cors());

// routing
app.use("/user", user);
app.use("/post", post);

// suppress the warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
// connect to db
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log("connected to DB!");
});

// listening on port 8000
app.listen(8000, ()=>{
    console.log("Listening on port 8000");
});
