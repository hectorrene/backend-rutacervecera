const mongoose = require("mongoose");
const BarSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    }, 
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    photo: {
        type: String,
        required: false,
        default: "https://www.gravatar.com/avatar/"
    },
    address: {
        street: { type: String, required: false, trim: true },
        city: { type: String, default: "Mexicali", trim: true },
        state: { type: String, default: "Baja California", trim: true },
        zipCode: { type: String, trim: true }
    },
    mapsUrl: {
        type: String,
        required: false,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    tags: {
        type: [String],
        enum: ["Beer Garden", "Refrigerado", "Talento cachanilla", "Cervezas locales", "Cervezas exportadas", "Comida",
                "Música en vivo", "Ambiente familiar", "Terraza", "Solo adultos", "Barra libre", "Sports bar"
        ],
        required: false,
        default: []
    },
    ratingAverage: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0'],
        max: [5, 'Rating must be below 5']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true 
});

BarSchema.virtual ('reviews', {
    ref: 'Review',
    foreignField: 'bar',
    localField: '_id'
});

// se calcula el rating 
BarSchema.virtual('averageRating').get(function() {
    if (this.ratingQuantity === 0) return 0;
        return this.ratingSum / this.ratingQuantity;
});

const Bar = mongoose.model("Bar", BarSchema);
module.exports = Bar;