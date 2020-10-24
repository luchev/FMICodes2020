const {Timestamp} = require( 'mongodb' );
const mongoose = require('mongoose');
const User = require('../models/User');

const offerSchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: User.name 
  },

  title: String,
  offer: String,
  price: Number,
  count: Number,
  startTime: Date,
  endTime: Date,

  image: String
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer; 
