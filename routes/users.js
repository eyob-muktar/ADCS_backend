const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = new express.Router();

const auth = require('../middleware/auth');
const  User = require('../models/users');
const {
    validateSignupData,
    validateLoginData
} = require('../validators.js');


router.post('/', async (req, res) => {
    let newUser = new User({
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        isAdmin: req.body.isAdmin
    });
    const { valid, errors } = validateSignupData(newUser, req.body.confirmPassword);
    if (!valid) return res.status(400).json(errors);
    let user = await User.findOne({email: newUser.email});
    if (user) return res.status(400).json({email: 'The email is already in use'});
    user = await User.findOne({phoneNumber: newUser.phoneNumber});
    if (user) return res.status(400).json({phoneNumber: 'The phone number is already in use'});
   

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    newUser.save((err, doc) => {
        if(err) res.status(400).send(err);
        else {
        const token = newUser.generateAuthToken();
        res.header('x-auth-token', token).status(200).send(doc)}
    });
})


router.post('/login', async(req, res) => {
    
    let user = {
        email: req.body.email,
        password: req.body.password
    };
    
    const { valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    user = await User.findOne({'email': user.email});
    if(!user) return res.status(403).json({general: 'Incorrect email or password'});
    const match = await bcrypt.compare(req.body.password, user.password);
    if(match) {
        const token = user.generateAuthToken();
        return res.status(200).header('x-auth-token', token).send({user});
    }
    res.status(403).json({general: 'Incorrect email or password'});
});


router.get('/me', auth, async (req, res) => {
   const user = await User.findById(req.user._id).select('-password');
   res.send(user); 
});


module.exports = router;