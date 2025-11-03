const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	user: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,

			},
			phoneNumber: {
				type: String,
				required: true,
				trim: true,
			}
		}),
		required: true
	},
	foods: [{
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true
			},
			qty: {
				type: Number,
				required: true
			}
		})
	}],
	orderTime: {
		type: Date,
		required: true,
		default: Date.now
	},
	totalPrice: {
		type: Number
	},
	status: {
		type: String,
		default: 'waiting'
	}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;