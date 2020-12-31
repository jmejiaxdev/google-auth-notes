const passportStrategy = require("passport-google-oauth20").Strategy;
// const mongoose = require("mongoose"); // FIXME: Remove
const user = require("../models/user");

// dotenv.config(); // FIXME: Remove

module.exports = (passport) => {
  passport.use(
    new passportStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile) => {
        console.log(profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    user.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
