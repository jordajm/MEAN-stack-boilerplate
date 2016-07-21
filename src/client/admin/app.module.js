(function () {
    'use strict';

    // define the applications main module inject all other modules
    angular.module('admin', [
        'ngMaterial',
        'ngImgCrop',
        'admin.components',
        'admin.services'
    ])
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('light-blue', {
          'hue-1': '100',
          'hue-2': '300',
          'hue-3': '900'
        })
        .accentPalette('orange')
        .warnPalette('red')
        .backgroundPalette('blue-grey', {
          'hue-1': '50'
        })
    });

})();
