exports.getAbstractImages = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.app.db.models.AbstractImage.find().exec(function(err, abstractImages) {
    if (err) {
      workflow.emit('exception', err);
    }

    workflow.outcome.abstractImages = abstractImages;
    workflow.emit('response');
  });
};

exports.getConcreteImages = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.app.db.models.ConcreteImage.find().exec(function(err, concreteImages) {
    if (err) {
      workflow.emit('exception', err);
    }

    workflow.outcome.concreteImages = concreteImages;
    workflow.emit('response');
  });
};

exports.createAbstractImage = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  var imageData = {
    imageUrl: req.body.imageUrl,
    styles: req.body.styles
  };

  req.app.db.models.AbstractImage.create(imageData, function(err) {
    if (err) {
      workflow.emit('exception', err);
    }

    workflow.emit('response');
  });
};

exports.createConcreteImage = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  var imageData = {
    imageUrl: req.body.imageUrl,
    styles: req.body.styles
  };

  req.app.db.models.ConcreteImage.create(imageData, function(err) {
    if (err) {
      workflow.emit('exception', err);
    }

    workflow.emit('response');
  });
};

exports.deleteAbstractImage = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.app.db.models.AbstractImage.findOneAndRemove({ _id: req.body.id }, function(err) {
    if (err) {
      workflow.emit('exception', err);
    }

    workflow.emit('response');
  });
};

exports.deleteConcreteImage = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  req.app.db.models.ConcreteImage.findOneAndRemove({ _id: req.body.id }, function(err) {
    if (err) {
      workflow.emit('exception', err);
    }

    workflow.emit('response');
  });
};


