const Order = require('../models/Order');
const Offer = require('../models/Offer')
const validator = require('validator');
const User = require('../models/User');
const { Callbacks } = require('jquery');
const { callbackPromise } = require('nodemailer/lib/shared');
/**
 * GET /orders
 */
exports.getOrders = async (req, res) => {

  let user 
  await User.findById(req.user._id, (err, foundUser) => {
    if (err) { return done(err); }
    user = foundUser
  });
  if(user.restaurantExtension !== undefined && user.restaurantExtension.restaurantName !== undefined) { 
    let orders  
    await Order.find( {restaurant: req.user._id}, (err, foundOrders) => {
        if (err) { return done(err); }
        orders = foundOrders;
      });
    var users = [], offers = [];
    for(var i=0 in orders) { 
      let user
      await User.findById(orders[i].user, (err, foundUser) => {
        if (err) { return done(err); }
        user = foundUser
      });
      let offer
      await Offer.findById(orders[i].offer, (err, foundOffer) => {
        if (err) { return done(err); }
        offer = foundOffer;
      });
      offers.push(offer);
      users.push(user);
    }
    res.render('orders', {
      title: 'Orders',
      orders: orders,
      X: offers,
      users: users,
      len: orders.length,
      isRestaurant: true
    })
  }
  else {
    let orders 
    await Order.find( {user: req.user._id}, (err, foundOrders) => {
      if (err) { return done(err); }
      orders = foundOrders;
    });
    var restaurants = [], offers = [];
    for(var i=0 in orders) { 
      let restaurant
      await User.findById(orders[i].restaurant, (err, foundUser) => {
        if (err) { return done(err); }
        restaurant = foundUser;
      });
      let offer
      await Offer.findById(orders[i].offer, (err, foundOffer) => {
        if (err) { return done(err); }
        offer = foundOffer;
      });
      offers.push(offer);
      restaurants.push(restaurant);
    }
    console.log(offers);
    res.render('orders', {
      title: 'Orders',
      orders: orders,
      restaurants: restaurants,
      X: offers,
      len: orders.length,
      isRestaurant: false
    })
  }
}

/**
 * GET /odrer/:id
 */
exports.getOrderById = (req, res) => {
    return Order.findById(req.params.id, (err, order) => {
        if (err) { return done(err); }
        return order;
  }).then((value) => {
      res.send(value);
  });
}
/**
 * POST /order
 */
exports.postOrder = async (req, res) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.userId)) validationErrors.push({ msg: 'userId cannot be blank.' });
  if (validator.isEmpty(req.body.restaurantId)) validationErrors.push({ msg: 'restaurantId cannot be blank.' });
  if (validator.isEmpty(req.body.offerId)) validationErrors.push({ msg: 'offerId cannot be blank.' });
  let offer
  await Offer.findById(req.body.offerId, (err, foundOffer) => {
    if (err) { return done(err); }
    offer = foundOffer;
  });
  console.log(offer)

  var currentTime = new Date();
  if(currentTime >= offer.endTime) {
    validationErrors.push({ msg: 'The offer has already expired.' });
  }
  if(offer.count <= 0) {
    validationErrors.push({ msg: 'The offer was already sold out.' });
  }

  if (validationErrors.length) {
    console.log('in the right place');
    res.send(400, validationErrors);
  }
  else {
    const order = new Order({
      user: req.body.userId,
      restaurant: req.body.restaurantId,
      offer: req.body.offerId,
      state: 'active'
    }); 
    var newCount = offer.count - 1;
    await Offer.updateOne( {_id: req.body.offerId}, {count: newCount});
    order.save();
  };
  res.send(200);
}
  