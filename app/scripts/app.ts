'use strict';

interface IMenuEntry {
  path?: string;
  icon?: string;
  label?: string;
}

class AppController {
  
  public static $inject = [
    '$scope',
    '$timeout',
    '$mdSidenav',
    '$mdUtil',
    '$log',
    '$location',
    'authService'
  ];
  
  constructor($scope, $timeout, $mdSidenav, $mdUtil, $log, $location: ng.ILocationService, authService: AuthService) {
    
    $scope.menus = {
      administrador: [
        { path: '/produtos'          , icon: 'local_cafe'         , label: 'Produtos' },
        { path: '/estoque'           , icon: 'widgets'            , label: 'Estoque' },
        { path: '/clientes'          , icon: 'face'               , label: 'Clientes' },
        { path: '/recarga'           , icon: 'attach_money'       , label: 'Recarga de saldo' },
        { path: '/restricoes'        , icon: 'block'              , label: 'Restrições' },
        { path: '/usuarios'          , icon: 'perm_identity'      , label: 'Usuários' },
        { path: '/vendas'            , icon: 'local_grocery_store', label: 'Vendas' },
        { path: '/vendas/frentecaixa', icon: 'restaurant_menu'    , label: 'Frente de caixa' }
      ],
      gerente: [
        { path: '/produtos'          , icon: 'local_cafe'         , label: 'Produtos' },
        { path: '/estoque'           , icon: 'widgets'            , label: 'Estoque' },
        { path: '/clientes'          , icon: 'face'               , label: 'Clientes' },
        { path: '/recarga'           , icon: 'attach_money'       , label: 'Recarga de saldo' },
        { path: '/restricoes'        , icon: 'block'              , label: 'Restrições' },
        { path: '/vendas'            , icon: 'local_grocery_store', label: 'Vendas' },
        { path: '/vendas/frentecaixa', icon: 'restaurant_menu'    , label: 'Frente de caixa' }
      ],
      atendente: [
        { path: '/vendas/frentecaixa', icon: 'restaurant_menu'    , label: 'Frente de caixa' }
      ],
	  responsavel: [
        { path: '/restricoes'        , icon: 'block'              , label: 'Restrições' },
        { path: '/vendas'            , icon: 'local_grocery_store', label: 'Vendas' }
	  ]
    }
    
    $scope.menusByRole = role => {
      role = angular.lowercase(role);
      if (role != null && role in $scope.menus) {
        return $scope.menus[role];
      } else {
        return [];
      }
    };
    
    $scope.toggleLeft = buildToggler('left');
    //$scope.toggleRight = buildToggler('right');
    
    $scope.close = function (path) {
      $mdSidenav('left').close();
      if(path){
        $location.path(path);
      }
    };
    
    $scope.auth = authService.authentication;
    
    $scope.logoff = function() {
      authService.logOut();
      $location.url('/login');
      $scope.close();
    };
    
    
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },200);
      return debounceFn;
    }
  }
}

/**
 * @ngdoc overview
 * @name cantinaSimplesClientApp
 * @description
 * # cantinaSimplesClientApp
 *
 * Main module of the application.
 */
var app = angular
  .module('cantinaSimplesClienteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngMessages',
    'ngMask',
    'LocalStorageModule',
    'angular-loading-bar',
	'blockUI'
  ])
  .controller('AppCtrl', AppController)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
      })
      .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          controllerAs: 'about'
      })
      .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginController',
          controllerAs: 'ctrl'
      })
      .when('/trocarsenha', {
          templateUrl: 'views/usuarios/trocarsenha.html',
          controller: 'TrocarSenhaController',
          controllerAs: 'ctrl',
          authorize: true
      })
      .when('/produtos', {
          templateUrl: 'views/produtos/listar.html',
          controller: 'ListaProdutosController',
          controllerAs: 'listCtrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/produtos/criar', {
          templateUrl: 'views/produtos/editar.html',
          controller: 'EditarProdutoController',
          controllerAs: 'editCtrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/produtos/editar/:id', {
          templateUrl: 'views/produtos/editar.html',
          controller: 'EditarProdutoController',
          controllerAs: 'editCtrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/estoque', {
          templateUrl: 'views/estoque/listar.html',
          controller: 'MovimentosEstoqueController',
          controllerAs: 'ctrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/estoque/criar', {
          templateUrl: 'views/estoque/criar.html',
          controller: 'CriarMovimentoEstoqueController',
          controllerAs: 'ctrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/clientes', {
          templateUrl: 'views/clientes/listar.html',
          controller: 'ClientesController',
          controllerAs: 'ctrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/clientes/criar', {
          templateUrl: 'views/clientes/editar.html',
          controller: 'EditarClienteController',
          controllerAs: 'editCtrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/clientes/editar/:id', {
          templateUrl: 'views/clientes/editar.html',
          controller: 'EditarClienteController',
          controllerAs: 'editCtrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/recarga', {
          templateUrl: 'views/clientes/recarga.html',
          controller: 'RecargaController',
          controllerAs: 'ctrl',
          authorize: ['administrador', 'gerente']
      })
      .when('/restricoes', {
          templateUrl: 'views/clientes/restricoes.html',
          controller: 'RestricoesController',
          controllerAs: 'ctrl',
          authorize: ['administrador', 'gerente', 'responsavel']
      })
      .when('/usuarios', {
          templateUrl: 'views/usuarios/listar.html',
          controller: 'UsuariosController',
          controllerAs: 'ctrl',
          authorize: ['administrador']
      })
      .when('/usuarios/criar', {
          templateUrl: 'views/usuarios/criar.html',
          controller: 'CriarUsuarioController',
          controllerAs: 'ctrl',
          authorize: ['administrador']
      })
      .when('/usuarios/editar/:id', {
          templateUrl: 'views/usuarios/editar.html',
          controller: 'EditarUsuarioController',
          controllerAs: 'ctrl',
          authorize: ['administrador']
      })
      .when('/vendas', {
          templateUrl: 'views/vendas/listar.html',
          controller: 'VendasController',
          controllerAs: 'ctrl',
          authorize: ['administrador', 'gerente', 'responsavel']
      })
      .when('/vendas/frentecaixa', {
          templateUrl: 'views/vendas/frenteCaixa.html',
          controller: 'FrenteCaixaController',
          controllerAs: 'ctrl',
          authorize: ['administrador', 'gerente', 'atendente']
      })
      .otherwise({
          redirectTo: '/login'
      });
  })
  .config(($httpProvider: ng.IHttpProvider, blockUIConfig) => {
    $httpProvider.interceptors.push('authInterceptorService');
    blockUIConfig.message = 'Carregando...';
  })
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  })
  .run(['$rootScope', '$location', 'authService', ($rootScope: ng.IRootScopeService, $location: ng.ILocationService, authService: AuthService) => {
      $rootScope.$on('$routeChangeStart', (event, next, current) => {
          var route = next.$$route;
          
          if (route == null) {
              return;
          }
          
          var authorize: string[] = route.authorize;
          var previous = $location.path();
          
          if (authorize && !authService.authentication.isAuth) {
              console.log(`View '${next.$$route.originalPath}' exige autenticação e o usuário não está autenticado.`);
              $location.path('/login').search('previous', previous);
              return;
          }
          
          if (angular.isArray(authorize)) {
              var role = angular.lowercase(authService.authentication.role);
              if (authorize.indexOf(role) === -1) {
                  console.log(`View '${next.$$route.originalPath}' não permite acesso do perfil do usuário.`);
                  $location.path('/login').search('previous', previous);
                  return;
              }
          }
      });
  }])
  .factory('produtosStore', ['$http', '$q', 'serviceBase', ($http, $q, serviceBase) => new RestApiProdutosStore($http, $q, serviceBase)])
  .factory('clientesStore', ['$http', '$q', 'serviceBase', ($http, $q, serviceBase) => new RestApiClientesStore($http, $q, serviceBase)])
  .factory('vendasStore', ['$http', 'serviceBase', ($http, serviceBase) => new RestApiVendasStore($http, serviceBase)])
  .factory('usuariosStore', ['$http', '$q', 'serviceBase', ($http, $q, serviceBase) => new RestApiUsuariosStore($http, $q, serviceBase)])
  .factory('movimentosEstoqueStore', ['$http', 'serviceBase', ($http, serviceBase) => new RestApiMovimentosEstoqueStore($http, serviceBase)])
  .factory('recargaService', ['$http', 'serviceBase', ($http, serviceBase) => new RestApiRecargaService($http, serviceBase)]);