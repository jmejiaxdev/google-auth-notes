import passport from "passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { User, userModel } from "../models/user";

const mapProfileToUser = ({ id, displayName, name, photos }: Profile): User => {
  const { givenName = "", familyName = "" } = name || {};
  return {
    googleId: id,
    displayName: displayName,
    firstName: givenName,
    lastName: familyName,
    image: photos && photos.length > 0 ? photos[0].value : "",
  };
};

const setAuthenticationStrategy = () => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const createUser = async () => await userModel.create(mapProfileToUser(profile));
          const user = await userModel.findOne({ googleId: profile.id });
          done(undefined, user ?? createUser());
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
};

const serializeUser = () => {
  passport.serializeUser((user, done) => {
    console.log("serializeUser", user);
    done(undefined, (user as User)?.id);
  });
};

const deserializeUser = () => {
  passport.deserializeUser((id, done) => {
    userModel.findById(id, (error, user: User) => {
      done(error, user);
    });
  });
};

export const initPassport = () => {
  setAuthenticationStrategy();
  serializeUser();
  deserializeUser();
};
