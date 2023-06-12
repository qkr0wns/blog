module.exports = {
  authUser: (req, res, next) => {
    if (!req.session.logged_in) {
      res.redirect('/login');
    }
    next();
  },
};