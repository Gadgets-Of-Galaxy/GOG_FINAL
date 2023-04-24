require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const Category = require("./models/category");
var MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

const app = express();
require("./config/passport");

// mongodb configuration
connectDB();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))

app.use(session({
  secret: 'GOG website',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {maxAge: 180 * 60 * 1000}
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//routes config
const indexRouter = require("./routes/index");
const {productsRouter} = require("./routes/products");
const userRouter = require("./routes/user");
const {adminRouter} = require("./routes/admin");
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/admin', adminRouter);
// app.use('/user', userRouter);


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("404", { title: '404'});
// });


var port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port, () => {
  console.log("Server running at port " + port);
});

module.exports = app;
