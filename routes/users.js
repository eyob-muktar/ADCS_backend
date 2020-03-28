const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = new express.Router();

const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const  User = require('../models/users');
const {
	validateSignupData,
	validateLoginData
} = require('../startup/validator.js');


//end point to register a new user
router.post('/', async (req, res) => {
	//check if the input data is valid
	const { valid, errors } = validateSignupData(req.body);
	if (!valid) return res.status(400).json(errors);

	//check if the name is already in use
	let user = await User.findOne({name: req.body.name});
	if (user) return res.status(400).json({name: 'The name is already in use'});
    
	//check if the phone number is already in use
	user = await User.findOne({phoneNumber: req.body.phoneNumber});
	if (user) return res.status(400).json({phoneNumber: 'The phone number is already in use'});
   
	//hash the password
	user = new User(_.pick(req.body, ['name', 'email', 'password', 'phoneNumber', 'isAdmin']));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();

	const token = user.generateAuthToken();
	res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'phoneNumber']));
});



//end point to log a user in
router.post('/login', async(req, res) => {
	//check if the input data is valid
	const { valid, errors } = validateLoginData(req.body);
	if (!valid) return res.status(400).json(errors);

	//check if the user is using the right credentials
	const user = await User.findOne({'name': req.body.name});
	if (!user) return res.status(400).json({general: 'Incorrect name or password'});
    
	const match = await bcrypt.compare(req.body.password, user.password);
	if (!match) return  res.status(400).json({general: 'Incorrect name or password'});

	const token = user.generateAuthToken();
	res.send(token);
    
});


//end point to return one's own user info
router.get('/me', auth, async (req, res) => {
	const user = await User.findById(req.user._id).select('-password. -isAdmin');
	if (!user) return res.send('The user no longer exist');
   
	res.send(user); 
});


//end point to return all the users
router.get('/', [auth, admin], async (req, res) => {
	const users = await User.find().sort('name').select('-password');
	if (users.length === 0) return res.send('There are no users in the database');

	res.send(users);
});


//end point to change the user balance
router.patch('/balance/:id', [auth, admin, validateObjectId], async (req, res) => {
	const user = await User.findByIdAndUpdate(req.params.id, { balance: req.body.balance }, { new: true }).select('-password');
	if(!user) return res.status(404).send('The user with the specified id was not found');

	res.send(user);
});


//end point to delete a user
router.delete('/me', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
    
	if(!user) return res.status(404).send('The user with the specified id was not found');

	const match = await bcrypt.compare(req.body.password, user.password);
	if(!match) return res.status(400).send('Incorrect Password');

	user.deleteOne();
});


//end point to find a user by name
router.get('/user', [auth, admin], async (req, res) =>{
	const user = await User.findOne({ name: req.body.name}).select('-password');
	if (!user) return res.status(404).send('The user with the specified name was not found');

	res.send(user);
});


module.exports = router;

