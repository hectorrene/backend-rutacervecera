const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Ingrese un correo electrónico válido"]
    }, 
    phone: {
        type: String,
        required: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                // Check if user is at least 18 years old
                const cutoffDate = new Date();
                cutoffDate.setFullYear(cutoffDate.getFullYear() - 18);
                return value <= cutoffDate;
            },
            message: 'Tienes que ser mayor de edad para registrarte'
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    photo: {
        type: String,
        required: false,
        default: "https://www.gravatar.com/avatar/"
    },
    accountType: {
        type: String,
        enum: ["business", "user"],
        default: "user"
    },
}, {
    timestamps: true 
});

// para no guardar la contraseña en el objeto JSON
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = this.password.split("").reverse().join("") + "simpleHash";
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;