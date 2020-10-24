const Offer = require('../models/Offer');
const User = require('../models/User')

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
 
	const idToName = {}
	restaurants.forEach(r => idToName[r._id] = r.restaurantExtension.restaurantName)

	Offer.find({})
		.sort('-updatedAt')
		.then(offers => {
			offers = offers.filter(o => idToName[o.restaurantId] !== undefined)
			offers.forEach(o => o._doc.restaurantName = idToName[o.restaurantId])
			
			res.render('offers', {
				title: 'Offers',
				offerItems: offers,
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