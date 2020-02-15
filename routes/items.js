const express = require('express');
const router = new express.Router();

const Item = require('../models/items');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { validateItemData } = require('../validators.js');


//end point to add a new item
router.post('/', [auth, admin], async (req, res) => {
    let newItem = new Item({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price
    });
    const { valid, errors } = validateItemData(newItem);
    if (!valid) return res.status(400).json(errors);

    newItem.save((err, doc) => {
        if(err) res.status(400).send(err);
        res.status(200).send(doc)
    });
});


//end point to get all the items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort('name');
        res.send(items);
    }
    catch (ex) {
        res.status(500).send('Something went wrong');
    }
});


//end point to get a specific item 
router.get('/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    if(!item) return res.status(404).send('The item with the given id was not found.');
    res.send(item);
})


//end point to delete a specific item
router.delete('/:id', [auth, admin], async (req, res) => {
    const item = await Item.findByIdAndRemove(req.params.id);
    if(!item) return res.status(404).send('The item with the given id was not found.');
    res.send(item);
})


module.exports = router;