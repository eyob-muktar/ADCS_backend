/* eslint-disable no-undef */
const express = require('express');
// const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = new express.Router();

const User = require('../models/users');

router.post('/', async (req, res) => {
	const token = crypto.randomBytes(20).toString('hex');
	const user = await User.findOneAndUpdate({email: req.body.email}, {
		resetPasswordToken: token,
		resetPasswordExpiry: Date.now() + 86400000
	});

	if(!user) return res.status(404).send('Email is not found');
	
	res.status(200).send(`http://localhost:3002/reset/${token}` );

	// const transporter = nodemailer.createTransport({
	// 	service: 'gmail',
	// 	auth: {
	// 		user: `${process.env.EMAIL_ADDRESS}`,
	// 		pass: `${process.env.EMAIL_PASSWORD}`
	// 	},
	// });

	// const mailOptions = {
	// 	from: 'ADCS@gmail.com',
	// 	to:`${user.email}`,
	// 	subject: 'Link To Reset Password',
	// 	text: 'Please click the following link or paste this into your browser to complete the process'
	// 		+ `http://localhost:3002/reset/${token}`
	// };

	// console.log('sending email');

	// transporter.sendMail(mailOptions, (err, response) => {
	// 	if (err) {
	// 		console.error('there is the res: ', err);
	// 	} else {
	// 		console.log('here is the res: ', response);
	// 		res.status(200).json('recovery email sent');
	// 	}
	// });
});

module.exports = router;