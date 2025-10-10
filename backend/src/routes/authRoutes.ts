import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';
import { signupValidation, loginValidation } from '../middleware/authMiddleware';
import passport from 'passport';

const router = Router();



router.post('/signup', signupValidation, signup);
router.post('/login',  loginValidation,  login);
router.post('/logout', logout);


// Google Login
router.get('/google', 
    passport.authenticate('google', {scope:['profile', 'email']})
)

// google callback
router.get('/google/callback', 
    passport.authenticate('google', {failureRedirect: '/login'}),
    (_req, res) => {
        // Successful authentication
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
)

// Github Login
router.get('/github',
    passport.authenticate('github', {scope: ['user:email']})
)

// github callback
router.get('/github/callback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    (_req, res) => {
        // Successful authentication
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
)

export default router;
