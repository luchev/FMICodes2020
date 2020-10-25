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
exports.postReview = ( req, res, next ) => {
  console.log(req.body)
  const review = new Review( {
    user: req.user._id,
    restaurant: req.body.restaurantId, // TODO update with restaurant, this is just an example
    // restaurant: req.restaurant._id,
    text: req.body.text,
    score: req.body.score,
  } );

  console.log(req.user._id);

  review.save((err) => {
    if ( err ) {
      // Failed to save
      console.log(err);
    }
  });
  res.redirect('/restaurants/' + req.body.restaurantId)
}; 

/* Retrieve all restaurants by given ID */
exports.getReviewsForRestaurant = (resId) => {
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
  getReviewsForRestaurant( req.user._id ).then( ( restaurants ) => {
    console.log( restaurants );
  } );

  // Get all reviews for given restaurant ID
  getReviewsForRestaurant( req.restaurant._id ).then( ( restaurants ) => {
    console.log( restaurants );
  } );
}

exports.getAverageRating = async (resId) => {
  reviews = await this.getReviewsForRestaurant(resId);

  const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
  const scores = reviews.map(r => r.score);

  if (scores.length == 0) {
    return 0;
  }

  const averageRating = average(scores);
  return averageRating;
}