const User = require('../models/User');
const Offer = require('../models/Offer');
const Review = require('../models/Review');

/**
 * GET /restaurants/:id
 * Gets restaurant by id
 */
exports.getRestaurant = async (req, res) => {
	let restaurant

	id = req.params.id

	await User.findById(id, (err, foundRestaurant) => {
		if (err) {
			res.redirect('/')
		}

		restaurant = foundRestaurant
	});

	let offer
	await Offer.findOne({restaurantId: id}, (err, foundOffer) => {
		if (err) {
			res.redirect('/')
		}

		offer = foundOffer
	})

	let reviews
	await Review.find({restaurantId: id}, (err, foundReviews) => {
		if (err) {
			res.redirect('/')
		}

		reviews = foundReviews
	});

	res.render('restaurant', {
		title: 'Restaurant',
		restaurant: restaurant,
		offer: offer,
		reviews: reviews,
	});
}

