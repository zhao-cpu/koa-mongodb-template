const mongoose = require("mongoose");

const Schema = new mongoose.Schema({});

const CityModel = mongoose.model("cities", Schema);

module.exports = CityModel;
