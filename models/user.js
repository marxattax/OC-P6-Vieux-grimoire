const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email.trim());
};

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        validate: [validateEmail, "{VALUE} n'est pas un email valide"],
        unique: true 
    },
    password: { 
        type: String,
        required: true 
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);