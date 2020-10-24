/**
 * GET /
 * Home page.
 */
const Offer = require('../models/Offer')

exports.index = (req, res) => {
  const offer = new Offer({
    restaurantId: '5f940d5baf10483b609f250f',
  
    offer: 'Свински врат',
    price: 5,
    count: 10,
    startTime: new Date(),
    endTime: new Date(),
  
    image: "asd"
  });
  offer.save();
  res.render('home', {
    title: 'Home'
  });
};
