const Offer = require('../models/Offer');

/**
 * GET /offers
 * Get all offers
 */
exports.getOffers = (req, res) => {
	const filter = (req.query.search || '') + '.*'
	Offer.find({title: {$regex: filter, $options: 'i'}})
	.sort('-updatedAt')
	.then((offers) => {
		res.render('offers', {
			title: 'Offers',
			X: offers,
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