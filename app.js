const express = require('express');
const path = require('path');
const pool = require("./db/pool");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;


const indexRouter = require('./routers/indexRouter');

require('dotenv').config()
const pgSession = require('connect-pg-simple')(session);

const PORT = process.env.PORT || 8080;
const app = express();

//setup for login sessions
app.use(session({
  store: new pgSession({
    pool : pool                // Connection pool
  }),
  secret: process.env.SECRET,
  resave: false,
  cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }, // 2 days
  saveUninitialized: true,
}));

//Set-up url request body parsing
app.use(express.urlencoded({ extended: false }));
//Set-up EJS
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");
//Set-up Public files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
//Set-up for classic session
app.use(passport.session());
//REMOVE LATER JUST TO SEE SESSIONS
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

//Set-up passport strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => { //try to remove try catch block for new express
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];
    done(null, user);
});

app.use('/', indexRouter);

//Error middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}. Rely.`));