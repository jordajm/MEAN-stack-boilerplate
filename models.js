'use strict';

exports = module.exports = function(app, mongoose) {

  require('./schema/Account')(app, mongoose);

  require('./schema/Invitation')(app, mongoose);

  require('./schema/PasswordReset')(app, mongoose);

  require('./schema/Style')(app, mongoose);

  require('./schema/Architect')(app, mongoose);

  require('./schema/PortfolioProject')(app, mongoose);

  require('./schema/Client')(app, mongoose);

  require('./schema/AbstractImage')(app, mongoose);

  require('./schema/ConcreteImage')(app, mongoose);

  require('./schema/Project')(app, mongoose);

  require('./schema/Product')(app, mongoose);
 
};