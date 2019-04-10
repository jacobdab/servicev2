const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, unique:true,required: true},
    password: String,
    dateOfBirth: {type: String,required:true},
    firstName: {type: String,required:true},
    lastName: {type: String,required:true},
    email: {type: String,unique: true,required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type:Boolean, default:false},
    perPage: {type:Number, default: 10},
    sort: {type:Number, default:1}
})


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);