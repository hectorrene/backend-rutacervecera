const mongoose = require("mongoose");
const menuItemSchema = new mongoose.Schema({

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
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    photo: {
        type: String,
        required: false,
        default: "https://www.gravatar.com/avatar/"
    },
    type: {
        type: String,
        enum: ["alcohol", "comida", "bebida"],
        default: "alcohol"
    },
    alcoholPercentage:{
        type: Number, 
        default: 0,
        min: 0,
        max: 100,
        validate: {
        validator: function(value) {
            return this.type !== 'alcohol' || value > 0;
        },
        message: "Una bebida alcohólica debe tener un porcentaje de alcohol mayor a 0"
        }
    },
    volume:{
        type: Number,
        default: 0,
        min: 0
    },
}, {
    timestamps: true 
});

menuItemSchema.index({ bar: 1, name: 1 }, { unique: true });
const menuItem = mongoose.model("menuItem", menuItemSchema);
module.exports = menuItem;