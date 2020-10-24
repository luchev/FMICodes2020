const User = require( '../models/User' );
/**
 * GET /
 * Home page.
 */
const Offer = require('../models/Offer')

exports.index = async (req, res) => {
  let restaurants = await getAllRestaurants();
  res.render('home', {
    title: 'Home',
    restaurants: JSON.stringify(restaurants),
  });
};

async function getAllRestaurants() {
  let restaurants = [];
  await User.find( {}, ( err, result ) => {
    if ( err ) {
      res.redirect( '/' )
    }

    for (const user of Array.from(result)) {
      if ( user.restaurantExtension !== undefined && user.restaurantExtension.restaurantName !== undefined ) {
        restaurants.push({
          id: user._id,
          ...user.restaurantExtension,
        });
      }
    }
  } );

  return restaurants;
}
