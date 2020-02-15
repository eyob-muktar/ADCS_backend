const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
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

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;