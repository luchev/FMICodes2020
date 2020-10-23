const Offer = require('../models/Offer');

/**
 * GET /offers
 * Get all offers
 */
exports.getOffers = (req, res) => {
	Offer.find({})
	.sort('-updatedAt')
	.then((offers) => {
		res.send(offers);
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