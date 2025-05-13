exports.getIndex = (req, res) => {
  res.send('<h1>Hello World</h1>');
};

exports.getRegister = (req, res) => {
  res.render('registerForm');
};