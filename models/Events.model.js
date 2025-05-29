const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
    
    bar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bar',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    start : {
        type: Date,
    },
    end : {
        type: Date,
    },
    image : {
        type: String,
        required: false,
        default: "https://www.gravatar.com/avatar/"
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true 
});


const Event = mongoose.model("Event", EventSchema);
module.exports = Event;