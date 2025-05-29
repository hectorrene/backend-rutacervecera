const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bar',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
}, {
    timestamps: true 
});

ReviewSchema.index({ user: 1, bar: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;