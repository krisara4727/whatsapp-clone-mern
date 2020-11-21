const mongoose = require('mongoose');

const whatsappSchema = mongoose.Schema({
    nameId:String,
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});



export default mongoose.model('messagecontents',whatsappSchema);
