// app.js
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Configure session middleware
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport to use Google strategy
passport.use(new GoogleStrategy({
    clientID: '607585863670-ueqdi01eh08sdv9ar67dr8tkbfo023ti.apps.googleusercontent.com',
    clientSecret: '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', // Your client secret
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirect back to the main page after successful login
        res.redirect('/?user=' + encodeURIComponent(JSON.stringify(req.user)));
    }
);

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle error if needed
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err); // Handle error if needed
            }
            res.redirect('/'); // Redirect to home after logout
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});