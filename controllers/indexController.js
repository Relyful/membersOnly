const pool = require("../db/pool");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

require('dotenv').config()

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
  const messages = await db.getAllMessages();
  res.render("index", {
    user: req.user,
    messages: messages
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
    await db.inserNewUser(data, hashedPassword);
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
  await db.insertNewMessage(messageData, user);
  res.redirect('/');
};

exports.getclubMemberForm = (req, res) => {
  res.render('clubMemberForm');
};

exports.postClubMemberForm = async (req, res) => {
  const password = req.body.secretPass;
  const userID = req.user.id;
  if (password === process.env.MEMBER_PASSWORD) {
    await db.setMemTrue(userID);
    res.redirect('/');
  }
  res.redirect('/clubForm');
};