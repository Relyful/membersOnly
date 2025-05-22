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
    .withMessage('Second Name must contain valid ASCII characters.'),
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
  async (req, res, next) => {
    console.log(req.body);
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).render('registerForm', {
        errors: errors.errors,
      })
      return;
    };
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      let result = await db.inserNewUser(data, hashedPassword);
      if (data.admin) {
        const newUserID = result.rows[0].id;
        await db.setAdmin(newUserID);
      }
      res.redirect('/login');
    } catch (err) {
      if (err.code && err.code === "23505") {
        return res.status(400).render('registerForm', {
          errors: [{msg: "Username already exists."}],
        });
      }
      return next(err);
    }
    
  }
];

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.render('loginForm', {
      loggedIn: true,
    })
  }
  res.render('loginForm');
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render('loginForm', {
        error: info.message,
      });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
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
    return res.redirect('/');
  }
  return res.render('clubMemberForm', {
    errors: "Wrong club password!"
  });
};

exports.getDeleteMessage = async (req, res) => {
  const id = req.params.messageId;
  await db.deleteMessage(id);
  res.redirect('/');
}