const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: 1
	},
	category: {
		type: String
	},
	description: {
		type: String
	},
	price: {
		type: Number,
		required: true
	},
	rating: {
		type: Number,
		default: null
	}
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;