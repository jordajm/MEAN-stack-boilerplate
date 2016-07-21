'use strict';

exports = module.exports = function(app, mongoose) {
  var concreteImageSchema = new mongoose.Schema({ 
    imageUrl: String,
    // styleName: String,
    // styleId: String,
    styles: [{
      styleName: String,
      styleId: String,
      rating: Number
    }],
    createdAt: { type: Date, default: Date.now }
  });
  
  app.db.model('ConcreteImage', concreteImageSchema);
};