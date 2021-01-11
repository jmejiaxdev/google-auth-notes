import passport from 'passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { userModel } from '../models/user';

const mapProfileToUser = ({
  id,
  displayName,
  name,
  photos,
}: Profile): Express.User => {
  const { givenName = '', familyName = '' } = name || {};
  return {
    googleId: id,
    displayName: displayName,
    firstName: givenName,
    lastName: familyName,
    image: photos && photos.length > 0 ? photos[0].value : '',
  };
};

export const init = () => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_ID || '',
        clientSecret: process.env.GOOGLE_SECRET || '',
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const createUser = await userModel.create(mapProfileToUser(profile));
          const user = await userModel.findOne({ googleId: profile.id });
          done(undefined, user ?? createUser);
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    done(undefined, user.id);
  });

  passport.deserializeUser((id, done) => {
    userModel.findById(id, (error, user) => {
      done(error, user ?? undefined);
    });
  });
};
