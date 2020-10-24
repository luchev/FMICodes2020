const mongoose = require('mongoose');
const User = require('./User');

const orderSchema = new mongoose.Schema({
    
  user : { type: mongoose.Schema.Types.ObjectId, ref: User.name },
  restaurant : { type: mongoose.Schema.Types.ObjectId, ref: User.name },
  // offer : { type: Schema.Types.ObjectId, ref: 'Offer' },
  state : {
      type : String,
      enum: ['active', 'paid',]
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
