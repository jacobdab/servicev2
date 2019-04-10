const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Devices = require('./Devices');

const ClientSchema = new mongoose.Schema({
    clientName: {type: String,required:true},
    contact: {type: String,required:true},
    address: String,
    nip: String,
    email: {type: String,unique: true,required: true},
    devices:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Devices',
        }],
    });

ClientSchema.index({
    clientName : 'text',
    contact : 'text',
    address : 'text',
    nip : 'text',
    email : 'text',
});
module.exports = mongoose.model('Client',ClientSchema);