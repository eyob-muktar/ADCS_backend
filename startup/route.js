const express = require('express');
const cors = require('cors');

const error = require('../middleware/error');
const userRouter = require('../routes/users');
const foodRouter = require('../routes/foods');
const orderRouter = require('../routes/orders');
const forgotPasswordRouter = require('../routes/forgotPassword');
const resetRouter = require('../routes/resetPassword');
const updatePasswordRouter = require('../routes/updatePassword');

// let allowCrossDomain = function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Headers', '*');
// 	next();

// }

module.exports = function(app) {
	app.use(cors());
	// app.use(allowCrossDomain);
	app.use(express.json());
	app.use('/users', userRouter);
	app.use('/foods', foodRouter);
	app.use('/orders', orderRouter);
	app.use('/forgotpassword', forgotPasswordRouter);
	app.use('/reset', resetRouter);
	app.use('/updatePassword', updatePasswordRouter);
	app.use(error);
};