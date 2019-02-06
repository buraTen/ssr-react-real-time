const mongoose = require('mongoose');
const { capitalize } = require('../utils');

const code = {
    type: String,
    unique: true,
    required: true,
    set: v => v.toLowerCase()
};

const name = {
    type: String,
    unique: true,
    required: true,
    set: v => capitalize(v)
};

const Countries = new mongoose.Schema({
    code,
    name
}, {
    versionKey: false
});

module.exports = mongoose.model('Countries', Countries);