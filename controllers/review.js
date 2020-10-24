const Review = require( '../models/Review' );
const User = require('../models/User');
/**
 * GET /review
 */
exports.reviewForm = ( req, res ) => {
  res.render( 'review', {
    title: 'Review'
  } );
};

/* Post a review - bound to review.pug POST */
exports.postReview = async ( req, res, next ) => {
  console.log('here')
  console.log(req.body)
  const review = new Review( {
    user: req.user._id,
    restaurant: req.body.restaurantId, // TODO update with restaurant, this is just an example
    // restaurant: req.restaurant._id,
    text: req.body.text,
    score: req.body.score,
  } );

  console.log(req.user._id);

  review.save();
  res.redirect('/restaurants/' + req.body.restaurantId)
}; 

/* Retrieve all restaurants by given ID */
function getRestaurantsById(resId) {
  return Review.find( {restaurant: resId}, ( err, restaurants ) => {
    if ( err ) {
      return [];
    } else {
      return restaurants;
    }
  } );
}

// Examples
function exampleReviews() {
  // Get all reviews for given user ID
  getRestaurantsById( req.user._id ).then( ( restaurants ) => {
    console.log( restaurants );
  } );

  // Get all reviews for given restaurant ID
  getRestaurantsById( req.restaurant._id ).then( ( restaurants ) => {
    console.log( restaurants );
  } );
}
