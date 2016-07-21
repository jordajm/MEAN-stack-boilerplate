var braintree = require('braintree');
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '7qbb7pz6nr4xsqtt',
  publicKey: '7yx6nkbb66k9pb88',
  privateKey: '79a0142c6320b5a9059f70173615d680'
});

exports.getClientToken = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  gateway.clientToken.generate({}, function (err, response) {
    if(err){
      return workflow.emit('exception', err);
    }

    workflow.outcome.clientToken = response.clientToken;
    workflow.emit('response');
  });
};

exports.submitPayment = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);
  var ObjectID = require('mongodb').ObjectID;

  workflow.on('submitPayment', function() {
    gateway.transaction.sale({
      amount: "150.00",
      paymentMethodNonce: req.body.nonce,
      customer: {
        email: req.body.clientEmail
      },
      options: {
        submitForSettlement: true
      }
    }, function (err, result) {
      if(err){
        return workflow.emit('exception', err);
      }

      if(result.success){
        workflow.emit('updateClientRecord', result);
      }else{
        workflow.emit('exception', result);
      }
    });
  });

  workflow.on('updateClientRecord', function(paymentInfo) {
    var query = {
      _id: new ObjectID(req.body.clientId)
    };

    var update = {
      consultationPaid: true,
    };

    req.app.db.models.Client.findOneAndUpdate(query, update, function(err, client) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');   
    }); 
  });

  workflow.emit('submitPayment');
};












