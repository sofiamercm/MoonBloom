// ─── Configuración de Passport con Google OAuth ─────────────────────────
// Permite registro / login con cuenta de Google.
// Si la usuaria ya existía (por email) se enlaza el googleId al usuario existente.

import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/user.model";

// Usamos valores por defecto si no están en el .env para evitar que Passport falle al inicializar
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "FALTA_CLIENT_ID";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "FALTA_CLIENT_SECRET";
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";

console.log("🛠️ Registrando estrategia de Google...");
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        // 1. Buscar por googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Buscar por email y enlazar
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // 3. Crear nuevo usuario
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: email,
        });
        return done(null, newUser);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// Passport requiere serializeUser/deserializeUser
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;