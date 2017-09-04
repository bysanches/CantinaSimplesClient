
interface LoginModel {
    userName: string;
    password: string;
}

class LoginController {
    public model: LoginModel;
    public message: string;
    
    static $inject = [
        '$location',
        '$mdToast',
        'authService'
    ];
    
    constructor(private $location: ng.ILocationService,
                private $mdToast: ng.material.IToastService,
                private authService: AuthService) {
        
        if (authService.authentication.isAuth) {
            $location.url('/');
        }
    }
    
    logar() {
        this.authService.login(this.model).then(response => {
            var search = this.$location.search();
            var path = search.previous || '/';
            
            this.$location.url(path);
        }, reason => {
            this.message = reason && reason.data && reason.data.error_description
                || 'Erro ao fazer login.';
            
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content(this.message)
					.hideDelay(3000));
        });
    }
}


angular.module('cantinaSimplesClienteApp')
       .controller('LoginController', LoginController);