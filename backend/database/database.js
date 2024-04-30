const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://utkarshmalik320:@Jaimatadi07@paytm-database.orrdb6x.mongodb.net/?retryWrites=true&w=majority&appName=paytm-database");

const userSchema = mongoose.Schema({
    username :{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:30
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    }
})

const User = mongoose.model('User', userSchema);
module.exports = {
    User
};