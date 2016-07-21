'use strict';

exports = module.exports = function(app, mongoose) {
  var portfolioProjectSchema = new mongoose.Schema({
    architectId: String,
    projectName: String,
    // constructionCost: Number,    (not using construction cost for now)
    hearthCost: Number,
    imageUrls: [String],
    timeframe: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  app.db.model('PortfolioProject', portfolioProjectSchema);
};