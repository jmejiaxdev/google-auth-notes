const ensureAuth = (req, res, next) => (req.isAuthenticated() ? next() : res.redirect("/"));

const ensureGuest = (req, res, next) => (req.isAuthenticated() ? res.redirect("/dashboard") : next());

module.exports = {
  ensureAuth,
  ensureGuest,
};
