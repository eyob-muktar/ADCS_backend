const express = require('express');
const router = new express.Router();

const User = require('../models/users');

router.get('/:token', async (req, res) => {
	const user = await User.findOne({ 
		resetPasswordToken: req.params.token,
		resetPasswordExpiry: {
			$gt: Date.now()
		}
	});
	if(!user) return res.status(404).send('password reset link is invalid or has been expired');

	res.status(200).send({
		name : user.name,
		message: 'password reset link is ok'
	});
});

module.exports = router;