const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = new express.Router();

const validateObjectId = require('../middleware/validateObjectId');
const Order = require('../models/orders');
const User = require('../models/users');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

Fawn.init(mongoose); //for transactions

//end point to add new order
router.post('/', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
	const price = req.body.totalPrice;

	let order = new Order({
		user: {
			name: user.name,
			phoneNumber: user.phoneNumber
		},
		foods: req.body.foods,
		totalPrice: price
	});

	if (order.totalPrice > user.balance) 
		return res.status(400)
			.send(`User don't have enough balance. Current balance ${user.balance}`);

	new Fawn.Task()
		.update('users', { _id: user._id }, {
			$inc: { balance: -price }
		})
		.save('orders', order)
		.run();
	res.send(order);
});


//end point to get all the orders sorted by order time descendingly
router.get('/', [auth, admin], async (req, res) => {
	const orders = await Order.find().sort({orderTime: -1});
	if (orders.length === 0) return res.json({order:'There are no orders'});

	res.send(orders);
});


//end point to delete a specific order
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
	const order = await Order.findById(req.params.id); 
	if (!order) return res.status(404).json({order: 'The order with the given id was not found'});

	const user = await User.findById(req.user._id);
	if (order.user.name !== user.name) return res.status(401).json({general:'Access denied'});
	if (order.status !== 'waiting') return res.status(400).json({general:'The order has already been started'});
    
	const price = order.totalPrice;
    
	new Fawn.Task()
		.remove('orders', {_id: order._id})
		.update('users', {_id: user._id}, {
			$inc: { balance: price }
		})
		.run();

	res.send(user);
});


//end point to find orders for a specific user
router.get('/myorders', auth, async (req, res) => {
	const user = await User.findById(req.user._id);

	const order = await Order.find({'user.name': user.name});
	if (order.length === 0) return res.json({order:'You have no orders'});

	res.send(order);
});


//end point to update the status of an order
router.patch('/status/:id', validateObjectId, async (req, res) => {
	const order = await Order.findByIdAndUpdate(req.params.id, {
		status: req.body.status },{
		new: true 
	});

	if (!order) return res.status(404).json({order:'The order with the given id was not found'});

	res.send(order);
});


module.exports = router;