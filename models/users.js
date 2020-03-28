const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
		trim: true,
		lowercase: true,
		unique: 1

	},
	email:{
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	password:{
		type: String,
		required: true,
		minlength: 6,
		maxlength: 1024
	},
	phoneNumber: {
		type: String,
		required: true,
		trim: true,
		unique: 1,
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	balance: {
		type: Number,
		default: 0,
		min: 0
	},
	resetPasswordToken: {
		type: String,
		default: null
	},
	resetPasswordExpiry: {
		type: String,
		default: null
	}
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
	return token;
};


const User = mongoose.model('User', userSchema);

module.exports = User;