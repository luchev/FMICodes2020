const Order = require('../models/Order');
const validator = require('validator');
const User = require('../models/User');
/**
 * GET /orders
 */
exports.getOrders = (req, res) => {
  function isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }

  User.findById(req.user._id, (err, user) => {
    if (err) { return done(err); }
    return user;
  }).then((value) => {
    console.log(value.restaurantExtension)
    if(value.restaurantExtension !== undefined && value.restaurantExtension.restaurantName !== undefined) { 
      Order.find( {restaurant: req.user._id}, (err, order) => {
        if (err) { return done(err); }
        return order;
      }).then((value) => {
        console.log(req.user._id + 'is restaurant')
        console.log(value)
        res.render('orders', {
          title: 'Orders',
          orders: value
        })
      })
    } else {
      Order.find( {user: req.user._id}, (err, order) => {
        if (err) { return done(err); }
        return order;
      }).then((value) => {
        console.log(req.user._id + 'is user')
        console.log(value)
        res.render('orders', {
          title: 'Orders',
          orders: value
        })
      })
    }
  });
}

/**
 * GET /odrer/:id
 */
exports.getOrderById = (req, res) => {
    console.log(888888)
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
exports.postOrder = (req, res) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.userId)) validationErrors.push({ msg: 'userId cannot be blank.' });
    if (validator.isEmpty(req.body.restaurantId)) validationErrors.push({ msg: 'restaurantId cannot be blank.' });
    //if (validator.isEmpty(req.body.offerId)) validationErrors.push({ msg: 'offerId cannot be blank.' });
    if (validationErrors.length) {
        req.flash('errors', validationErrors);
    }
    const order = new Order({
      user: req.body.userId,
      restaurant: req.body.restaurantId,
      state: 'active'
    }); 
    order.save(function(err, doc) {
      if (err) {
        console.log(err);
      }
    }); 
  };
  
