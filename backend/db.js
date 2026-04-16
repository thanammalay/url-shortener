const mongoose = require("mongoose");

mongoose.connect("mongodb://mongo:27017/urlshortener");

module.exports = mongoose;