(function() {
    'use strict';

    function appModel($rootScope, $location) {

        function getAPIUrl(){
            var url = $location.absUrl();
            if(url.indexOf('localhost') >= 0){
                return '';
            }else{
                return 'http://hearth-app.herokuapp.com';
            }
        }
        
        var model = {
            userData: undefined,
            cloudfrontImageUrl: 'https://d2c1fkmbosl3nh.cloudfront.net/',
            APIUrl: getAPIUrl()
        };

        return model;
    }

    appModel.$inject = ['$rootScope', '$location'];

    angular.module('admin')
        .factory('adminAppModel', appModel);
})();
