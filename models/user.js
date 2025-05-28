const mongoose = require("mongoose");

// Corrected MongoDB connection URI
mongoose.connect("mongodb://127.0.0.1:27017/socialapp") ; 

// Define schema
const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String
});

module.exports = mongoose.model("user", userSchema);
