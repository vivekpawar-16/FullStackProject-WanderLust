const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passortLocalMongosse = require("passport-local-mongoose");

const userSchema = new Schema({

    email : {

        type : String,

        required : true
    }
});



User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);