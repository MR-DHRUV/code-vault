const mongoose = require('mongoose');

// schema for storing records
const RecordSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    codeLanguage : {
        type : String,
        enum: ['C++', 'Java', 'JavaScript', 'Python'],
        required : true
    },
    input : {
        type : String,
        required : true
    },
    output : {
        type: String,
        required : true
    },
    sourceCode : {
        type : String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


const RecordStore = mongoose.model('records',RecordSchema);
module.exports = RecordStore;