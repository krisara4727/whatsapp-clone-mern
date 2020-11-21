const mongoose = require('mongoose');

const whatsappSchemaUser = mongoose.Schema({
    email:String,
    password:String,
});

export default mongoose.model('userCredentials',whatsappSchemaUser);