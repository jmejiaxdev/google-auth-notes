const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const handlebars = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const passportConfig = require("./config/passport");
const session = require("express-session");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo");
const methodOverride = require("method-override");
const formatDate = require("./helpers/formatDate.js");

const port = 3000;

const app = express();

// Load dotenv config
dotenv.config();

// Mongoose
connectDb();

// app.use(require('morgan')('dev')); FIXME

// Handlebars
app.engine(".hbs", handlebars({ defaultLayout: "main", extname: ".hbs", helpers: { formatDate } })); // Express template engine
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views/"));

// Express sessions
const MongoStoreFactory = connectMongo(session);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStoreFactory({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
passportConfig(passport);

app.use(passport.initialize());
app.use(passport.session());

// Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));

app.listen(port, console.log("Listening at port 3000"));
