const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Devices = require('./Devices');

const MonthFinances = new mongoose.Schema({
        created: Date,
        price: Number,
        profit: Number,
        costOfRepair: Number,
});

module.exports = mongoose.model('MonthFinances',MonthFinances);