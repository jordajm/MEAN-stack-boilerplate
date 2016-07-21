'use strict';

exports = module.exports = function(app, passport) {

  // Dashboard
  app.get (['/', '/admin'], require('./views/dashboard/dashboard').init);

  // Admin
  app.get ('/admin/styles/getlist', require('./views/styles/styles').getStyles);
  app.post('/admin/styles/create', require('./views/styles/styles').createStyle);
  app.post('/admin/styles/delete', require('./views/styles/styles').deleteStyle);
  app.get ('/admin/images/get/abstract', require('./views/images/images').getAbstractImages);
  app.get ('/admin/images/get/concrete', require('./views/images/images').getConcreteImages);
  app.post('/admin/images/new/abstract', require('./views/images/images').createAbstractImage);
  app.post('/admin/images/new/concrete', require('./views/images/images').createConcreteImage);
  app.post('/admin/images/delete/abstract', require('./views/images/images').deleteAbstractImage);
  app.post('/admin/images/delete/concrete', require('./views/images/images').deleteConcreteImage);
  app.get ('/admin/architect/getList', require('./views/admin/admin').getArchitectList);
  app.post('/admin/architect/makeAvailable', require('./views/admin/admin').makeArchitectAvailable);
  app.post('/admin/architect/makeUnavailable', require('./views/admin/admin').makeArchitectUnavailable);

  // AWS
  app.get ('/sign_s3', require('./views/aws/aws').signS3);

  // Auth
  app.get ('/user', require('./views/auth/auth').getUserData);
  app.post('/user/invite', require('./views/auth/auth').inviteUser);
  app.post('/user/delete', require('./views/auth/auth').deleteUser);
  app.get ('/user/list', require('./views/auth/auth').listUsers);
  app.get ('/user/create-first-admin', require('./views/auth/auth').renderCreateFirstAdminView);
  app.post('/user/create-first-admin', require('./views/auth/auth').createFirstAdmin);
  app.get ('/user/accept', require('./views/auth/auth').renderAcceptInvite);
  app.post('/user/accept', require('./views/auth/auth').acceptInvite);
  app.post('/user/login', require('./views/auth/auth').login);
  app.get ('/user/logout', require('./views/auth/auth').logout);
  app.post('/user/convert-to-architect', require('./views/auth/auth').convertUserToArchitect);
  app.post('/user/signup', require('./views/auth/auth').signup);

   // Forgot Password
  app.post('/user/forgot', require('./views/forgot/forgot').forgotPassword);
  app.get ('/user/forgot/:resetToken/', require('./views/forgot/forgot').initResetPage);
  app.post('/user/reset/checktoken/', require('./views/forgot/forgot').checkResetToken);
  app.post('/user/reset', require('./views/forgot/forgot').resetPassword);
  app.post('/user/changePassword', require('./views/forgot/forgot').changePassword);

  // Braintree
  app.get ('/braintree/clientToken', require('./views/braintree/braintree').getClientToken);
  app.post('/braintree/submitPayment', require('./views/braintree/braintree').submitPayment);

};









