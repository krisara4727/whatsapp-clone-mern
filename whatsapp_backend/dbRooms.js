import mongoose from 'mongoose';

const roomsSchema = mongoose.Schema({
    name: String,
});

export default mongoose.model('rooms',roomsSchema); 