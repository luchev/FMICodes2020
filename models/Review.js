const mongoose = require( 'mongoose' );

const reviewSchema = new mongoose.Schema( {
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: {type: String},
  score: {type: Number},
} );

const Review = mongoose.model( 'Review', reviewSchema );

module.exports = Review;

// TODO execute in mongo to add double index
// db.reviews.createIndex( {user: 1, restaurant: 1}, { unique: true })
