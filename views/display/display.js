'use strict';

exports.init = function(req, res){
  var parent = __dirname.substring(0, __dirname.indexOf('/views'));
  res.sendFile( parent + '/views/display.html');
};