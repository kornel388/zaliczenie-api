const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const usersRoutes = require("./api/routes/users");
const booksRoutes = require("./api/routes/books");

require("dotenv").config();
const app = express();


mongoose.connect(
    `${process.env.MONGO_CONNECTION_STRING}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Polaczono z DB");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/users", usersRoutes);
app.use("/books", booksRoutes);

module.exports = app;
