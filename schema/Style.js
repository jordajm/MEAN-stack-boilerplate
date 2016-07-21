'use strict';

exports = module.exports = function(app, mongoose) {
  var styleSchema = new mongoose.Schema({ 
    name: String
  });
  
  app.db.model('Style', styleSchema);
};