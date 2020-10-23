const Order = require('../models/Order');
const validator = require('validator');

/**
 * GET /order
 */
exports.getOrder = (req, res) => {
    res.render('orders', {
        title: 'Orders'
    })
  };

/**
 * GET /odrer/:id
 */
exports.getOrderById = (req, res) => {
    console.log(req.params.id)
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
  
