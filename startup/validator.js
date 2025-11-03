const validator = require('validator');

exports.validateSignupData = (data) => {
	let errors = {};

	if (!data.email) errors.email = 'Must not be empty';
	else if (validator.isEmpty(data.email)) errors.email = 'Must not be empty';
	else if (!validator.isEmail(data.email)) errors.email = 'Must be a valid email address';

	if (!data.name) errors.name = 'Must not be empty';
	else if (validator.isEmpty(data.name)) errors.name = 'Must not be empty';
	else if (!validator.isAlpha(data.name)) errors.name = 'Must only contain letters';

	if (!data.password) errors.password = 'Must not be empty';
	else if (validator.isEmpty(data.password)) errors.password = 'Must not be empty';
	else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';

	if (!data.phoneNumber) errors.phoneNumber = 'Must not be empty';
	else if (validator.isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';
	else if (!validator.isMobilePhone(data.phoneNumber)) errors.phoneNumber = 'Must be a valid phone number';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

exports.validateLoginData = (data) => {
	let errors = {};

	if (!data.name) errors.name = 'Must not be empty';
	else if (validator.isEmpty(data.name)) errors.name = 'Must not be empty';

	if (!data.password) errors.password = 'Must not be empty';
	else if (validator.isEmpty(data.password)) errors.password = 'Must not be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

exports.validateFoodData = (data) => {
	let errors = {};

	if (!data.name) errors.name = 'Must not be empty';
	else if (validator.isEmpty(data.name)) errors.name = 'Must not be empty';
	else if (!validator.isAlpha(data.name)) errors.name = 'Must only contain letters';

	if (!data.price) errors.price = 'Must not be empty';
	else if (validator.isEmpty(data.price)) errors.price = 'Must not be empty';
	else if (!validator.isInt(data.price, {gt: 1})) errors.price = 'Must be a positive number';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

