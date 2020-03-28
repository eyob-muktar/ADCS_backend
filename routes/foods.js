const express = require('express');
const router = new express.Router();

const validateObjectId = require('../middleware/validateObjectId');
const Food = require('../models/foods');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { validateFoodData } = require('../startup/validator.js');


//end point to add a new food
router.post('/', [auth, admin], async (req, res) => {
	const { valid, errors } = validateFoodData(req.body);
	if (!valid) return res.status(400).json(errors);

	const food = new Food({
		name: req.body.name,
		category: req.body.category,
		description: req.body.description,
		price: req.body.price
	});
	await food.save();

	res.send(food);
});


//end point to get all the foods
router.get('/', async (req, res) => {
	const foods = await Food.find().sort('name');
	if (foods.length === 0) return res.send('There are no foods in database');

	res.send(foods);
});


//end point to get a specific food by name
router.get('/search/', async (req, res) => {
	const food = await Food.findOne({name: req.query.name});
	if (!food) return res.status(404).send('There is no food with the given name');

	res.send(food);
});


//end point to get a specific food by id
router.get('/:id', validateObjectId, async (req, res) => {
	const food = await Food.findById(req.params.id);
	if (!food) return res.status(404).send('The food with the specified id was not found.');

	res.send(food);
});


//end point to give a rating 
router.patch('/rating/:id', [ auth, validateObjectId ], async (req, res) => {
	const food = await Food.findByIdAndUpdate(req.params.id, { rating: req.body.rating }, { new: true });
	if (!food) return res.status(404).send('The food with the specified id was not found');

	res.send(food);
});


//end point to update food info
router.patch('/:id', [ auth, admin, validateObjectId ], async (req, res) => {
	const food = await Food.findByIdAndUpdate(req.params.id, { 
		name: req.body.name,
		category: req.body.category,
		description: req.body.description,
		price: req.body.price,
	}, { new: true });
	if (!food) return res.status(404).send('The food with the specified id was not found');

	res.send(food);
});


//end point to delete a specific food
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
	const food = await Food.findByIdAndDelete(req.params.id);
	if(!food) return res.status(404).send('The food with the given id was not found.');

	res.send(food);
});


module.exports = router;