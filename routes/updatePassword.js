const express = require('express');
const bcrypt = require('bcrypt');
const router = new express.Router();

const User = require('../models/users');

router.put('/', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const newPassword = await bcrypt.hash(req.body.password, salt);
	const user = await User.findOneAndUpdate(
		{name: req.body.name},
		{ 
			password: newPassword, 
			resetPasswordToken: null, 
			resetPasswordExpiry: null
		});
	if(!user) return res.status(404).send('The user is not found');
    
	res.status(200).send('Password updated successfully');
});

module.exports = router;