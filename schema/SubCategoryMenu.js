const mongoose = require('mongoose');

const SubCategoryMenuSchema = new mongoose.Schema({
    subCategory: String,
    manufacturer : String,
    type: String,
    name: String,
    imageHR : String,
    imageTH : String,
});

SubCategoryMenuSchema.index({
    name: 'text',
    manufacturer: 'text',
    type: 'text',
});
module.exports = mongoose.model('SubCategoryMenu',SubCategoryMenuSchema);