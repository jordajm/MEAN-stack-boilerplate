'use strict';

exports = module.exports = function(app, mongoose) {
  var invitationSchema = new mongoose.Schema({ 
    invitedTime: { type: Date, default: Date.now },
    invitedEmail: String,
    accepted: { type: Boolean, default: false },
    acceptedTime: String,
    isAdmin: { type: Boolean, default: false },
  });
  
  app.db.model('Invitation', invitationSchema);
};