import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'; 
import User from "../models/User.mjs";
// import { comparePassword } from "../utils/helper.mjs";


export default function (passport) {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: process.env.JWT_SECRET, 
    };

  passport.use(
    new LocalStrategy({usernameField:"username"},async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      } 
      catch (err) {
        return done(err);
      }
    })
  );

  
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user); 
      } else {
        return done(null, false); 
      }
    } catch (err) {
      return done(err, false);
    }
  }));
}


