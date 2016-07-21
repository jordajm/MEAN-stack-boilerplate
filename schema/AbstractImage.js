'use strict';

exports = module.exports = function(app, mongoose) {
  var abstractImageSchema = new mongoose.Schema({ 
    imageUrl: String,
    styles: [{
      styleName: String,
      styleId: String,
      rating: Number
    }],
    createdAt: { type: Date, default: Date.now }
  });
  
  app.db.model('AbstractImage', abstractImageSchema);
};