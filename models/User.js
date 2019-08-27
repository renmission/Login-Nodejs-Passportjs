const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: String
});

// PASSWORD ENCRYPTION
// UserSchema.methods.validPassword = function (password) {
//     return (this.password === password);
// };

module.exports = mongoose.model('User', UserSchema);