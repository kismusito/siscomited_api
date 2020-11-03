const { model, Schema } = require("mongoose");

const mailTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    permit: {
        type: String,
        enum: ['admin' , 'radication' , 'lawyer' , 'director'],
        required: true,
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
} , {strict: "throw"});


module.exports = model('MailType' , mailTypeSchema);