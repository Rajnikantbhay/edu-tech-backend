const router = require('express').Router();
const User = require('../utils/User');
const bcrpt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { set } = require('mongoose');
const secretKey = 'iuyuitufdgcvbnbmuydfcvnjkuytufvhmbjktufhdcbnmgjfghcnbmhjgfhgc';
const revokedTokens = new Set();

router.post('/api/user-login', [

    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')

], async (req, res) => {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()})
        }
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(401).json({message: 'Invalid Credentials'})
        }

        const hashedPass = await bcrpt.compare(password, user.password);
        if(!hashedPass) {
            return res.status(401).json({message: 'Invalid Credentials'})
        }

        jwt.sign({ userId: user._id, name: user.name }, secretKey, {expiresIn: '1h'}, (err, token) => {
            if (err) {
                return res.status(500).json({ message: 'An error occurred' });
            }
            
            const refreshToken = jwt.sign({ name: user.name }, secretKey, {expiresIn: '1d'});
            const accessTokenInMemory = token;
            
            // Set the token in a cookie and send the response
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true }).status(200).json({success: true, token})
        });

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
})

router.get('/api/verify-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    if (revokedTokens.has(refreshToken)) {
        return res.status(401).json({ message: 'Token revoked' });
    }

    jwt.verify(refreshToken, secretKey, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // The token is verified, you can respond with a success message
        return res.status(200).json({ message: 'Valid token', decoded: decoded});
    });
});

router.post('/api/logout', (req, res) => {
    try {
    res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, sameSite: 'none', secure: true }).json(true);

    console.log('after clear')
    
    } catch (error) {
        console.log('revokedToken: ', error)
    }
});

module.exports = router;