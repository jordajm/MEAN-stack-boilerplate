'use strict';

exports.port = process.env.PORT || '3300';

exports.mongodb = {
  uri: process.env.MONGODB_URI || 'localhost:27017/hearth'
  // uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost:27017'
};

exports.cookieSecret = '68d1baa5-6750-4a5c-b351-056ccf73a3d4';

exports.sessionSecret = '712372be-4f21-4777-8894-163a7655e6d3';

exports.sendgrid  = require('sendgrid')("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");

exports.newHomeQuoteConfig = {
  basePricing: {
    schematicDesign: 4000,
    designDevelopment: 8000,
    constructionDocuments: 5000
  },
  multipliers: {
    xs: 0.5,
    sm: 0.7,
    md: 1,
    lg: 1.3,
    xl: 1.5
  }
};

exports.remodelQuoteConfig = {
  basePricing: {
    schematicDesign: 2000,
    designDevelopment: 6000,
    constructionDocuments: 3000
  },
  multipliers: {
    xs: 0.5,
    sm: 0.7,
    md: 1,
    lg: 1.3,
    xl: 1.5
  },
  useOfSpacePrices: {
    kitchen: {
      schematicDesign: 2000,
      designDevelopment: 3000,
      constructionDocuments: 1000
    },
    bathroom: {
      schematicDesign: 1500,
      designDevelopment: 2000,
      constructionDocuments: 1000
    },
    bedroom: {
      schematicDesign: 500,
      designDevelopment: 1000,
      constructionDocuments: 500
    },
    living: {
      schematicDesign: 500,
      designDevelopment: 1000,
      constructionDocuments: 500
    },
    addition: {
      schematicDesign: 2000,
      designDevelopment: 4000,
      constructionDocuments: 3000
    },
  }
};

exports.extrasQuoteConfig = [
  {
    name: 'Help you choose a builder',
    price: 500,
    description: 'Your architect will help you request and assess bids from builders in your area'
  },
  {
    name: 'Help you get building permits',
    price: 800,
    description: 'Your architect will help you work with your local building department to get permits issued'
  },
  {
    name: 'Make your bed in the morning',
    price: 1200,
    description: 'Your architect will come to your house and make your bed when you wake up in the morning'
  }
];






