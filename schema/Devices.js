const mongoose = require('mongoose'),
    mongooseAI = require('mongoose-auto-increment'),
    Client = require('./Client'),


DevicesSchema = new mongoose.Schema({
    manufacturer: String,
    model: String,
    created: {type: Date, default: Date.now},
    lastChange: {type: Date, default: Date.now},
    dayOfEnd: {type: Date},
    imei: String,
    image: String,
    status: {type:String,default: 'In repair'},
    warranty: String,
    express: String,
    repair: String,
    diagnose: String,
    result: String,
    today: Number,
    id: String,
    timer: Date,
    findMyiPhone: String,
    delivery: String,
    lockCode: String,
    condition: String,
    data: String,
    client:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
        }],
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes',
    }],
    price: Number,
    profit: Number,
    costOfRepair: Number,
    secretKey: {type:Number,unique:true,default:  () =>{
           return Math.floor(Math.random() * (999999 - 100000)) + 100000
        }}
});

mongooseAI.initialize(mongoose.connection);
DevicesSchema.plugin(mongooseAI.plugin,{model: 'Devices',field:'id'});
DevicesSchema.index({
    model: 'text',
    imei: 'text',
    repair: 'text',
    id: 'text',
    weights: {model: 2, imei: 10, repair: 4, id: 7}
});
/*const DeviceSchema = new mongoose.model('Devices',DevicesSchema)
devices = new DeviceSchema();
devices.resetCount(function(err, nextCount) {

});
devices.resetCount(function(err, nextCount) {

});*/
module.exports = new mongoose.model('Devices',DevicesSchema)