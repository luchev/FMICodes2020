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
		if (restaurant) {
			restaurant = restaurant.restaurantExtension
		}
	});

	let offer
	await Offer.findOne({restaurantId: id}, (err, foundOffer) => {
		if (err) {
			res.redirect('/')
		}

		offer = foundOffer
		if (!offer) {
			offer = new Offer({
				restaurantId: req.user._id,
				title: '',
				offer: '',
				price: 0,
				count: 0,
				startTime: Date.now(),
				endTime: Date.now(),
				image: '',
			});
			offer.save();
		}
	})

	let reviews
	await Review.find({restaurant: id}, (err, foundReviews) => {
		if (err) {
			res.redirect('/')
		}
		reviews = foundReviews
	});
	console.log(reviews)

	let renderPage = 'restaurant_view';
	if ( req.user && id === req.user.id ) {
		renderPage = 'restaurant_edit';
	}

	res.render(renderPage, {
		title: 'Restaurant',
		restaurant: restaurant,
		offer: offer,
		reviews: reviews,
	});
}
/**
 * POST /restaurants/:id
 * Updates restaurant by id
 */
exports.postRestaurant = async ( req, res ) => {
	console.log(1)
	let user = req.user;
	user.restaurantExtension.restaurantName = req.body.name;
	user.restaurantExtension.xCoordinate = req.body.xCoordinate;
	user.restaurantExtension.yCoordinate = req.body.yCoordinate;
	user.restaurantExtension.address = req.body.address;
	await User.updateOne( {_id: user._id}, {restaurantExtension: user.restaurantExtension});

	let offerUpdate = {
		title: req.body.title,
		offer: req.body.offer,
		price: req.body.price,
		count: req.body.count,
		startTime: Date.parse(req.body.startTime),
		endTime: Date.parse(req.body.endTime),
		image: req.body.image,
	}

	await Offer.updateOne( {restaurantId: user._id}, offerUpdate );
	res.send(200);
}
