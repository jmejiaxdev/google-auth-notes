const app = require("express")();
const expressHandlebars = require("express-handlebars");
const dotenv = require("dotenv");
var path = require("path");
const connectDb = require("./config/db");

const port = 3000;

// Load dotenv config
dotenv.config();

// Mongoose
connectDb();

// Handlebars
app.engine(".hbs", expressHandlebars({ defaultLayout: "main", extname: ".hbs" })); // Express template engine
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views/"));

// Routes
app.use("/", require("./routes/index.js"));

app.listen(port, console.log("Listening at port 3000"));
