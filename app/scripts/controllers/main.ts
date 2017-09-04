'use strict';

/**
 * @ngdoc function
 * @name cantinaSimplesClienteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cantinaSimplesClienteApp
 */
angular.module('cantinaSimplesClienteApp')
  .controller('MainCtrl', function ($location, authService) {
    if (!authService.authentication.isAuth) {
      $location.url('/login');
    }
  });
