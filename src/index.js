const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const path = require("path");
const http = require("http");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(methodOverride("_method"));

app.use(morgan("combined"));

//template engine
const hbs = handlebars.create({
  extname: ".hbs",
  helpers: {
    sum: function (a, b) {
      return a + b;
    },
    compare: function (a, b) {
      return a == b;
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));
const route = require("./routes");
//Route init
route(app);

//connect db
const db = require("./congif/db");
db.connect();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
