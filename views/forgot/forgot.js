'use strict';

exports.forgotPassword = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  var resetToken = Math.random().toString(36).substr(2, 7);
  
  workflow.on('checkIfUserExists', function(){
    req.app.db.models.Account.findOne({ username: req.body.email }, function(err, user) {
      if (err) {
        workflow.emit('exception', err);
      }
      if(user){
        workflow.emit('saveResetObject');
      }else{
        workflow.outcome.errfor.errDetail = 'User does not exist';
        return workflow.emit('response');
      }
    });
  });
  
  workflow.on('saveResetObject', function(){
    var resetObj = {
      email: req.body.email,
      resetToken: resetToken
    };
    req.app.db.models.PasswordReset.create(resetObj, function(err) {
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.emit('sendResetEmail');
    });
  });
  
  workflow.on('sendResetEmail', function(){
    var payload   = {
      to      : req.body.email,
      from    : "support@didash.com",
      subject : 'Password Reset Instructions',
      text    : 'Hello,\nWe received a request to help you reset your password.\nTo reset your password, click this link and choose a new password:\nhttp://di-dash-primary.herokuapp.com/user/forgot/' + resetToken + '\nIf you\'re still having problems, email us at support@didash.com and we\'ll be glad to help.\nThanks!\nThe DI-Dash Team'
    };
    req.app.config.sendgrid.send(payload, function(err, json) {
      if (err) { 
        return workflow.emit('exception', err);
      }
      workflow.emit('response');
    });
  });

  workflow.emit('checkIfUserExists');
};

exports.initResetPage = function(req, res){
  var parent = __dirname.substring(0, __dirname.indexOf('/views'));
  res.sendFile( parent + '/views/admin.html');
};

exports.checkResetToken = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('checkIfResetObjExists', function(){
    req.app.db.models.PasswordReset.findOne({ resetToken: req.body.resetToken }, function(err, resetObj) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (resetObj) {
        workflow.outcome.data = resetObj;
        workflow.emit('response');
      }else{
        workflow.outcome.errfor.errDetail = 'No Password Reset Token was found for this URL';
        return workflow.emit('response');
      }
    });
  });
  
  workflow.emit('checkIfResetObjExists');
};

exports.resetPassword = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('resetPassword', function(){

    req.app.db.models.Account.findByUsername(req.body.email).then(function(user){
        if (user){
            user.setPassword(req.body.password, function(){
                user.save();
                return workflow.emit('deleteResetObj');
            });
        } else {
            workflow.emit('exception', 'User not found - password could not be reset');
        }
    },function(err){
        workflow.emit('exception', err);
    });

  });
  
  workflow.on('deleteResetObj', function(){
    req.app.db.models.PasswordReset.find({ email: req.body.email }).remove( function(err) {
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.emit('response');
    });
  });
  
  workflow.emit('resetPassword');
};

// This method is used by the Change Password dialog box if a user is already logged in and wants to change their PW
exports.changePassword = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('resetPassword', function(){
     req.app.db.models.User.encryptPassword(req.body.first, function(err, hash) {
        if (err) {
          return workflow.emit('exception', err);
        }
        
        var userQuery = { _id: req.body.userId };
        var userUpdate = { password: hash };
        var userOptions = {};
        req.app.db.models.Account.findOneAndUpdate(userQuery, userUpdate, userOptions, function(err) {
          if (err) {
            return workflow.emit('exception', err);
          }
          workflow.emit('response');
        });
     });
  });
  
  workflow.emit('resetPassword');
};





