'use strict';

exports = module.exports = function(app, mongoose) {
  var accountSchema = new mongoose.Schema({ 
    username: String,
    type: String,        // Architect or Client
    architectId: String, // if user is an Architect
    clientId: String,    // if user is a Client
    isAdmin: { type: Boolean, default: false },
    isArchitect: { type: Boolean, default: false },
    styleFinderComplete: { type: Boolean, default: false},
    password: String
  });

  accountSchema.plugin( require('passport-local-mongoose') );
  
  app.db.model('Account', accountSchema);
};
