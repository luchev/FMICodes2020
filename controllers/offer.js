const Offer = require('../models/Offer');
const User = require('../models/User');
const review = require('./review');

/**
 * GET /offers
 * Get all offers
 */
exports.getOffers = async (req, res) => {
	let restaurants = []
	await User.find({restaurantExtension: { $exists: true, $ne: null }}, (err, foundRestaurants) => {
		if (err) {
			res.redirect('/')
		}

		restaurants = foundRestaurants
	});

	if (req.query.search) {
		const searchString = req.query.search.toLowerCase();
		restaurants = restaurants.filter(r => r.restaurantExtension.restaurantName !== null)
		restaurants = restaurants.filter(r => r.restaurantExtension.restaurantName.toLowerCase().startsWith(searchString))
	}

	Offer.find({})
		.sort('-updatedAt')
		.then(async offers => {
			const promises = []
			restaurants.forEach(r => promises.push(review.getAverageRating(r._id)))
			const p = await Promise.all(promises)

			for (let i = 0; i < p.length; i++) {
				restaurants[i].averageRating = p[i];
			}

			const idToName = {}
			restaurants.forEach(r => idToName[r._id] = r.restaurantExtension.restaurantName)

			const idToScore = {}
			restaurants.forEach(r => idToScore[r._id] = r.averageRating)

			offers = offers.filter(o => idToName[o.restaurantId] !== undefined)
			offers.forEach(o => {
				o.restaurantName = idToName[o.restaurantId];
				o.averageRating = idToScore[o.restaurantId]
			})

			res.render('offers', {
				title: 'Offers',
				OfferItems: offers,
			})
		});
} 

/**
 * GET /offers/{id}
 * Get offer by id
 */
exports.getOffer = (req, res) => {
	Offer.find({restaurantId: req.params.id})
	.sort('-updatedAt')
	.then((offers) => {
		res.send(offers);
	});
}