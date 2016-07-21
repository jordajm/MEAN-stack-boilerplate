'use strict';

exports = module.exports = function(app, mongoose) {
  var projectSchema = new mongoose.Schema({ 
    clientId: String,
    architectId: String,
    productIds: [String],
    type: String,                     // Remodel or New Construction
    zipcode: String,
    accessibilityNeeds: String,
    energyEfficiency: String,
    bedroomCount: Number,
    bathroomCount: Number,
    storiesCount: Number,
    squareFootage: Number,
    minBudget: Number,
    maxBudget: Number,
    lotSlope: String,                 // flat, slightly sloped, mountainside
    lotIsOwned: String,               // Has the lot for this project already been purchased?
    userUploadedImageUrls: [String],  // Cloudfront URLs for user uploaded images
    homePreferences: [],
    remodelSquareFootage: Number,
    remodelTypes: {},
    quote: {
        schematicDesign: Number,
        designDevelopment: Number,
        constructionDocuments: Number,
        extras: []
    },
    createdAt: { type: Date, default: Date.now }
  });
  
  app.db.model('Project', projectSchema);
};