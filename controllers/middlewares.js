exports.authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  };
  res.status(403).send("You don't have permission to access this page");
};


exports.adminMiddleware = (req, res, next) => {
  if (req.user.admin_status) {
    return next();
  };
  res.status(403).send("You're not an admin! You can't be here!");
};