const router = require('express').Router();
const User = require('../utils/User');
const { body, validationResult } = require('express-validator');
const escapeHtml = require('escape-html');
const bcrpt = require('bcrypt')
const salt = 10;

router.post('/api/register-user', [

    body('name').notEmpty().withMessage('name is required').isLength({min: 2}).withMessage('name must be atleast of two characters'),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('enter a valid email'),
    body('password').notEmpty().withMessage('password is required').isLength({min: 8}).withMessage('password must be atleast of 8 characters')

], async (req, res) => {

    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body;
        const hashedPassword = await bcrpt.hash(password, salt);
        const newUser = await User.create({name: escapeHtml(name), email: escapeHtml(email), password: escapeHtml(hashedPassword)})
        await newUser.save()

        res.json({success: true});

    } catch (error) {
        throw error
    }
})

module.exports = router