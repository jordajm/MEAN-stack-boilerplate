exports.signS3 = function(req, res){
    var AWS = require('aws-sdk');
    AWS.config.loadFromPath('./awsConfig.json');
    // aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new AWS.S3();
    var s3_params = {
        Bucket: req.query.bucket_name,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://' + req.query.bucket_name + '.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
};