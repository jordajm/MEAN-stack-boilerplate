'use strict';

exports = module.exports = function(app, mongoose) {
  var productSchema = new mongoose.Schema({ 
    name: String,
    type: String,        // Primary or Add-On
    paid: Boolean,
    description: String,
    cost: Number,
    createdAt: { type: Date, default: Date.now }
  });
  
  app.db.model('Product', productSchema);
};