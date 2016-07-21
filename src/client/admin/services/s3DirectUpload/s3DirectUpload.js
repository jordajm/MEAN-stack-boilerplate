angular.module('admin.services.s3DirectUpload', [])
  
    .factory('s3UploaderService', ['$http', function($http) {

      function upload_file(file, signed_request, url) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_request);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Success uploading directly to S3!');
            }
        };
        xhr.onerror = function() {
            alert("Could not upload file.");
        };
        xhr.send(file);
      }
        
      return {
          
        getSignedRequest: function(file, randomName, bucketName, imgFileType){
          var xhr = new XMLHttpRequest();
          var fileType = file.type || imgFileType;
          xhr.open("GET", "/sign_s3?file_name="+randomName+"&file_type="+fileType+"&bucket_name="+bucketName);
          xhr.onreadystatechange = function(){
              if(xhr.readyState === 4){
                  if(xhr.status === 200){
                      var response = JSON.parse(xhr.responseText);
                      upload_file(file, response.signed_request, response.url);
                  }
                  else{
                      alert("Could not get signed URL.");
                  }
              }
          };
          xhr.send();
        },

        dataURItoBlob: function(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for(var i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        }


      };
}]);