exports.getArchitectList = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.app.db.models.Architect.find().exec(function(err, architects) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.architectList = architects;
      workflow.emit('response');   
  });  
};

exports.makeArchitectAvailable = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);
  var ObjectID = require('mongodb').ObjectID;

  var query = {
    _id: new ObjectID( req.body.architectId )
  };

  var update = {
    isAvailable: 'Yes'
  };

  req.app.db.models.Architect.findOneAndUpdate(query, update, function(err) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.emit('response');   
    });  
};

exports.makeArchitectUnavailable = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);
  var ObjectID = require('mongodb').ObjectID;

  var query = {
    _id: new ObjectID( req.body.architectId )
  };

  var update = {
    isAvailable: 'No'
  };

  req.app.db.models.Architect.findOneAndUpdate(query, update, function(err) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.emit('response');   
    });  
};










