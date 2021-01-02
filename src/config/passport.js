const googleStrategy = require("passport-google-oauth20").Strategy;
const userSchema = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const createUser = async () =>
            await userSchema.create({
              googleId: profile.id,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              image: profile.photos[0].value,
            });
          const user = await userSchema.findOne({ googleId: profile.id });
          done(null, user ? user : createUser()); // TODO: Add babel ??
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userSchema.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
