
angular.module('cantinaSimplesClienteApp')
       .factory('authService', ['$http', '$q', 'localStorageService', 'serviceBase', function ($http: ng.IHttpService, $q: ng.IQService, localStorageService, serviceBase) {

    var authServiceFactory: any = {};

    var _authentication: Authentication = {
        isAuth: false,
        userName : '',
        nome: '',
        role: ''
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        var deferred = $q.defer();

        $http.post(serviceBase + 'oauth/token', data, { 
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response: ng.IHttpPromiseCallbackArg<LoginResponse>) => {

            localStorageService.set('authorizationData', {
                token: response.data.access_token,
                userName: loginData.userName,
                nome: response.data.nome,
                role: response.data.role
            });

            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.nome = response.data.nome;
            _authentication.role = response.data.role;

            deferred.resolve(response);

        }).catch(reason => {
            _logOut();
            deferred.reject(reason);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = '';
        _authentication.nome = '';
        _authentication.role = '';

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData)
        {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.nome = authData.nome
            _authentication.role = authData.role;
        } else {
            _authentication.isAuth = false;
            _authentication.userName = '';
            _authentication.nome = '';
            _authentication.role = '';
        }

    }

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    authServiceFactory.fillAuthData();

    return <AuthService>authServiceFactory;
}]);

interface Authentication {
    isAuth: boolean;
    userName: string;
    nome: string;
    role: string;
}

interface AuthService {
    saveRegistration(registration): ng.IHttpPromise<{}>;
    login(loginData): ng.IPromise<LoginResponse>;
    logOut(): void;
    fillAuthData(): void;
    authentication: Authentication;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    nome: string;
    role: string;
}