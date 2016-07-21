exports.getUserData = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.outcome.data = req.user;
  workflow.emit('response');

};

exports.listUsers = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.app.db.models.Account.find().exec(function(err, accounts) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.data = accounts;
      workflow.emit('response');      
  });

};

exports.signup = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);
  var passport = require('passport');
  var ObjectID = require('mongodb').ObjectID;
  var accountId = new ObjectID();
  var clientId = new ObjectID();

  workflow.on('checkIfUserExists', function() {
    req.app.db.models.Account.findOne({ username: req.body.email }, function(err, user) {
      if (err){
        return workflow.emit('exception', err);
      }

      if(user){
        return workflow.emit('exception', 'User already exists');
      }

      workflow.emit('createAccount');
    });

  });

  workflow.on('createAccount', function() {
    var userData = {
      _id: accountId,
      username : req.body.email,
      clientId: clientId
    };
    req.app.db.models.Account.register(new req.app.db.models.Account(userData), req.body.password, function(err, account) {
        if (err) {
            return workflow.emit('exception', err);
        }

        workflow.emit('createClient');

    });
  });

  workflow.on('createClient', function() {
    var clientData = {
      _id: clientId,
      email : req.body.email,
      accountId: accountId
    };
    
    req.app.db.models.Client.create(clientData, function(err) {
      if (err) {
          return workflow.emit('exception', err);
      }

      workflow.emit('response');
    });
  });

  workflow.emit('checkIfUserExists');
};

exports.login = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);
  var passport = require('passport');

  passport.authenticate('local')(req, res, function (err) {
    if(err){
      return workflow.emit('exception', err);
    }

    workflow.emit('response');
  });
};

exports.logout = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.logout();
  workflow.emit('response');

};

exports.inviteUser = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('checkIfUserExists', function() {
    req.app.db.models.Account.findOne({ username: req.body.email }, function(err, user) {
      if (err){
        return workflow.emit('exception', err);
      }

      if(user){
        return workflow.emit('exception', 'User already exists');
      }

      workflow.emit('createInvite');
    });

  });

  workflow.on('createInvite', function() {
    var inviteData = {
      invitedEmail: req.body.email,
      isAdmin: req.body.admin
    };
    req.app.db.models.Invitation.create(inviteData, function(err) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('sendInviteEmail');

    });

  });

  workflow.on('sendInviteEmail', function() {
    var payload   = {
      to      : req.body.email,
      from    : 'support@myhearthapp.com',
      subject : 'Hearth Invitation',
      text    : 'You have been invited to create an account at Hearth.\n\nPlease accept this invitation and log in.\n\nClick here to accept the invitation: https://hearth.herokuapp.com/user/accept\n\nThanks,\nThe Hearth Team\n\nQuestions? We\'re here to help:\nsupport@myhearthapp.com'
    };
    req.app.config.sendgrid.send(payload, function(err, json) {
      if (err) {
       return workflow.emit('exception', err); 
      }

      res.redirect('/user/accept');
    });
  });

  workflow.emit('checkIfUserExists');

};

exports.deleteUser = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.app.db.models.Account.findByIdAndRemove(req.body.userId, function(err) {
    if (err) {
      return workflow.emit('exception', err);
    }

    workflow.emit('response');
  });

};

exports.renderCreateFirstAdminView = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('ensureNoUsersExist', function() {

    req.app.db.models.Account.find().limit(1).exec(function(err, accounts) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if(!accounts.length){
        return workflow.emit('sendFirstAdminView');
      }else{
        res.redirect('/');
      }
      
    });
  });

  workflow.on('sendFirstAdminView', function() {
    var parent = __dirname.substring(0, __dirname.indexOf('/views'));
    res.sendFile( parent + '/views/init.html');
  });

  workflow.emit('ensureNoUsersExist');
};

exports.createFirstAdmin = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('ensureNoUsersExist', function() {
    req.app.db.models.Account.find().limit(1).exec(function(err, accounts) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if(accounts.length){
        return workflow.emit('exception', 'Users already exist in database. Please log in to add new users.');
      }

      workflow.emit('createInvitationRecord');
      
    });
  });

  workflow.on('createInvitationRecord', function() {

    var inviteData = {
      invitedEmail: req.body.email,
      isAdmin: true
    };
    req.app.db.models.Invitation.create(inviteData, function(err) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('sendInviteEmail');

    });

  });

  workflow.on('sendInviteEmail', function() {
    
    var payload   = {
      to      : req.body.email,
      from    : 'support@hearth.com',
      subject : 'Hearth admin invitation',
      text    : 'Welcome to Hearth.\n\nPlease accept this invitation and log in.\n\nClick here to accept the invitation: https://hearth.herokuapp.com/user/accept\n\nThanks,\nThe Hearth Team\n\nQuestions? We\'re here to help:\nsupport@myhearthapp.com'
    };
    req.app.config.sendgrid.send(payload, function(err, json) {
      if (err) {
       return workflow.emit('exception', err); 
      }

      res.redirect('/user/accept');
    });

  });

  workflow.emit('ensureNoUsersExist');
};


exports.renderAcceptInvite = function(req, res) {

  var parent = __dirname.substring(0, __dirname.indexOf('/views'));
  res.sendFile( parent + '/views/admin.html');

};


exports.acceptInvite = function(req, res) {
  var workflow = req.app.utility.workflow(req, res),
      passport = require('passport'),
      ObjectID = require('mongodb').ObjectID,
      accountId = new ObjectID(),
      clientId = new ObjectID(),
      isAdmin;

  workflow.on('checkIfInviteExists', function() {
    req.app.db.models.Invitation.findOne({ 'invitedEmail': req.body.email }, function (err, invite) {
      
      if (err){
        return workflow.emit('exception', err);
      }

      if(!invite){
        return workflow.emit('exception', 'Sorry, we weren\'t able to find an invitation under that email address.');
      }

      isAdmin = invite.isAdmin;
      workflow.emit('createAccount');

    });
  });

  workflow.on('createAccount', function() {
    var userData = {
      _id: accountId,
      username : req.body.email,
      isAdmin: isAdmin,
      clientId: clientId
    };
    req.app.db.models.Account.register(new req.app.db.models.Account(userData), req.body.password, function(err, account) {
        if (err) {
            return workflow.emit('exception', err);
        }

        if(isAdmin){
          workflow.emit('createClientRecord');
        }else{
          workflow.emit('updateInvite');
        }

    });

  });

  workflow.on('createClientRecord', function() {
    var clientData = {
      _id: clientId,
      email : req.body.email,
      accountId: accountId
    };
    
    req.app.db.models.Client.create(clientData, function(err) {
      if (err) {
          return workflow.emit('exception', err);
      }

      workflow.emit('updateInvite');
    });
  });

  workflow.on('updateInvite', function(){

    var inviteQuery = { 'invitedEmail': req.body.email };
    var inviteUpdate = { accepted: true };
    var inviteOptions = {};

    req.app.db.models.Invitation.findOneAndUpdate(inviteQuery, inviteUpdate, inviteOptions, function(err) {

      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');

    });
  });

  workflow.emit('checkIfInviteExists');

};



exports.convertUserToArchitect = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);
  var ObjectID = require('mongodb').ObjectID;
  var architectId = new ObjectID();
  var stylePercentages;

  workflow.on('ensureUserExists', function() {
    req.app.db.models.Account.findOne({ username: req.body.email }, function(err, user) {
      if (err){
        return workflow.emit('exception', err);
      }

      if(!user){
        return workflow.emit('exception', 'User doesn\'t exist');
      }

      workflow.emit('getStylePercentages');
    });
  });

  workflow.on('getStylePercentages', function() {
    req.app.db.models.Client.findOne({ email: req.body.email }, function(err, client) {
      if (err){
        return workflow.emit('exception', err);
      }

      stylePercentages = client.stylePercentages;
      workflow.emit('createArchitectDocument');
    });
  });

  workflow.on('createArchitectDocument', function() {
    var dataToSave = { 
      _id: architectId, 
      email: req.body.email,
      stylePercentages: stylePercentages
    };

    req.app.db.models.Architect.create(dataToSave, function(err) {
      if (err){
        return workflow.emit('exception', err);
      }

      workflow.emit('convertUserToArchitect');
    });
  });

  workflow.on('convertUserToArchitect', function() {
    var update = { isArchitect: true, architectId: architectId };

    req.app.db.models.Account.findOneAndUpdate({ username: req.body.email }, update, function(err) {
      if (err){
        return workflow.emit('exception', err);
      }

      workflow.emit('sendNotificationEmail');
    });
  });

  workflow.on('sendNotificationEmail', function() {
    var payload   = {
      to      : req.body.email,
      from    : 'support@myhearthapp.com',
      subject : 'Please create your architect profile on Hearth',
      text    : 'You have been invited to become an architect at Hearth.\n\nPlease click this link, log in with the same username and password that you created when you set up your original Hearth account, and click the link in the user menu that says "Architect Profile": https://hearth.herokuapp.com\n\nThanks,\nThe Hearth Team\n\nQuestions? We\'re here to help:\nsupport@myhearthapp.com'
    };
    req.app.config.sendgrid.send(payload, function(err, json) {
      if (err) {
       return workflow.emit('exception', err); 
      }

      workflow.emit('response');
    });
  });

  workflow.emit('ensureUserExists');

};













