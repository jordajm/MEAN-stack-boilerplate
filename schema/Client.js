'use strict';

exports = module.exports = function(app, mongoose) {
  var clientSchema = new mongoose.Schema({ 
    accountId: String,
    firstName: String,
    lastName: String,
    city: String,
    state: String,
    phone: String,
    email: String,
    profileImageUrl: String,
    projectIds: [String],
    abstractImageIds: [String],                // Push in objects with style ratings for each selected abstract image
    architecturalLayoutPreference: String,     // Cozy, Open, or In Between
    concreteImageIds: [String],            // Push in objects with style ratings for each selected home image
    stylePercentages: {},
    selectedArchitectId: String,
    selectedArchitectFirstName: String,
    selectedArchitectLastName: String,
    selectedArchitectPhone: String,
    selectedArchitectEmail: String,
    consultationPaid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  
  app.db.model('Client', clientSchema);
};