'use strict';

exports = module.exports = function(app, mongoose) {
  var architectSchema = new mongoose.Schema({ 
    firstName: String,
    lastName: String,
    city: String,
    state: String,
    phone: String,
    email: String,
    bio: String,
    profileImageUrl: String,
    stylePercentages: {},
    isAvailable: { type: String, default: 'Yes' },
    portfolioProjectIds: [],
    clientIds: [String],
    createdAt: { type: Date, default: Date.now }
  });
  
  app.db.model('Architect', architectSchema);
};