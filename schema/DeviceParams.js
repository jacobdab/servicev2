const mongoose = require('mongoose'),
    SubCategoryMenu = require('./SubCategoryMenu');

const DeviceParamsSchema = new mongoose.Schema({
    model: String,
});

DeviceParamsSchema.index({
    model: String,
});
module.exports = mongoose.model('DeviceParams',DeviceParamsSchema);