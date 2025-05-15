const pool = require("../db/pool");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .isAscii()
    .withMessage('First Name must contain valid ASCII characters.'),
  body("secondName")
    .trim()
    .notEmpty()
    .isAscii()
    .withMessage('Secoond Name must contain valid ASCII characters.'),
    body('username')
    .trim()
    .notEmpty()
    .isLength({min: 5})
    .withMessage("Username must be atleast 5 characters!"),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords must match!"),
  body('password')
    .trim()
    .notEmpty()
    .isLength({min: 5})
    .withMessage('Password must be atleast 5 characters long.'),
]

exports.getIndex = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM messages");
  console.log(rows);
  res.render("index", {
    user: req.user,
    messages: rows
  });
};

exports.getRegister = (req, res) => {
  res.render('registerForm');
};

exports.postRegister = [
  registerValidation,
  async (req, res) => {
    console.log(req.body);
    const data = req.body;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      res.status(400).render('registerForm', {
        errors: null,
      })
      return;
    };
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await pool.query(`INSERT INTO users (fname, sname, username, password) VALUES ($1, $2, $3, $4)`, [data.firstName, data.secondName, data.username, hashedPassword]);
    res.redirect('/');
  }
];

exports.getLogin = (req, res) => {
  res.render('loginForm');
};

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "login"
});

exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.getNewMessage = (req, res) => {
  res.render('newMessageForm');
};

exports.postNewMessage = async (req, res) => {
  const messageData = req.body;
  const user = req.user;
  await pool.query(`INSERT INTO messages (title, text, created_by)
    VALUES ($1, $2, $3)`, [messageData.title, messageData.text, user.id]);
  res.redirect('/');
}