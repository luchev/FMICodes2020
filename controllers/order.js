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
  User.findById(req.user._id, (err, foundUser) => {
    if (err) { return done(err); }
    user = foundUser
  }).then((user) => {
    if(user.restaurantExtension.restaurantName !== null) { 
        Order.find( {restaurant: req.user._id}, (err, foundOrders) => {
          if (err) { return done(err); }
          orders = foundOrders;
        }).then((orders) => {

          var users = [], offers = [];
          var promises = [];
          for(var i=0 in orders) { 
            promises.push(User.findById(orders[i].user, (err, foundUser) => {
              if (err) { return done(err); }
              var user = foundUser
              users.push(user);
            }));
            promises.push(Offer.findById(orders[i].offer, (err, foundOffer) => {
              if (err) { return done(err); }
              var offer = foundOffer;
              offers.push(offer);
            }));
          }
          Promise.all(promises).then(() => {
            res.render('orders', {
              title: 'Orders',
              orders: orders,
              X: offers,
              users: users,
              len: orders.length,
              isRestaurant: true
            });
          })
      });
    }
    else {
      let orders 
      Order.find( {user: req.user._id}, (err, foundOrders) => {
        if (err) { return done(err); }
        orders = foundOrders;
      }).then((orders) => {
        var restaurants = [], offers = [];
        var promises = []
        for(var i=0 in orders) { 
          promises.push(User.findById(orders[i].restaurant  , (err, foundUser) => {
            if (err) { return done(err); }
            var restaurant = foundUser;
            restaurants.push(restaurant);
          }));
          promises.push(Offer.findById(orders[i].offer, (err, foundOffer) => {
            if (err) { return done(err); }
            offer = foundOffer;
            offers.push(offer);
          }));
        }
        Promise.all(promises).then(() => {  
          res.render('orders', {
            title: 'Orders',
            orders: orders,
            restaurants: restaurants,
            X: offers,
            len: orders.length,
            isRestaurant: false
          })
        })
      });
    }
  });
}

exports.changeStatus = (req, res) => {
  Order.findById(req.body.orderId, (err, order) => {
    if (err) { return done(err); }
      return order;
  }).then((value) => {
    if(value.state == 'active')
      Order.findByIdAndUpdate(req.body.orderId, {state: 'paid'}).then(() => {
        res.redirect('/orders');
      });
    else 
      Order.findByIdAndUpdate(req.body.orderId, {state: 'active'}).then(() => {
        res.redirect('/orders');
      })
  });
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

  if (req.body.userId !== undefined && validator.isEmpty(req.body.userId)) validationErrors.push({ msg: 'userId cannot be blank.' });
  if (req.body.restaurantId !== undefined && validator.isEmpty(req.body.restaurantId)) validationErrors.push({ msg: 'restaurantId cannot be blank.' });
  // if (req.body.offerId !== undefined && validator.isEmpty(req.body.offerId)) validationErrors.push({ msg: 'offerId cannot be blank.' });
  Offer.findOne({restaurantId: req.body.restaurantId}, (err, foundOffer) => {
    if (err) { return done(err); }
    offer = foundOffer;
  }).then((offer) => {

    var currentTime = new Date();
    if(currentTime >= offer.endTime) {
      validationErrors.push({ msg: 'The offer has already expired.' });
    }
    if(offer.count <= 0) {
      validationErrors.push({ msg: 'The offer was already sold out.' });
    }
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      res.redirect('/restaurants/' + req.body.restaurantId);
    }
    else {
      const order = new Order({
        user: req.body.userId,
        restaurant: req.body.restaurantId,
        offer: offer.id,
        state: 'active'
      }); 
      var newCount = offer.count - 1;
      Offer.update( {_id: offer.id}, {count: newCount}).then( ()=> 
        {
          order.save();
          res.redirect('/restaurants/' + req.body.restaurantId);
        });
    };
  });
}
  