exports.authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  };
  req.status(403).send("You don't have permission to access this page");
};