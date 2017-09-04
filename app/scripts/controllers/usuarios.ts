interface FiltroUsuarios {
    email: string;
    nome: string;
}

class UsuariosController {
    public usuarios: Usuario[];
    public filtro: FiltroUsuarios;
    
    static $inject = [
        '$timeout',
        '$location',
        '$mdToast',
        '$mdDialog',
        'usuariosStore',
        'authService'
    ];
    
    constructor(private $timeout: ng.ITimeoutService,
                private $location: ng.ILocationService,
                private $mdToast: angular.material.IToastService,
                private $mdDialog: angular.material.IDialogService,
                private store: UsuariosStore,
                private authService: AuthService) {
        this.carregar();
    }
    
    carregar() {
        this.store.getAll().then(usuarios => {
            this.$timeout(() => this.usuarios = usuarios);
        }).catch(reason => {
            console.log(reason);
            this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao buscar os usuários.')
					.hideDelay(3000));
        });
    }
    
    criar() {
        this.$location.url('/usuarios/criar');
    }
    
    editar(usuario: Usuario) {
        this.$location.url(`/usuarios/editar/${usuario.id}`);
    }
    
    filtrar() {
        this.usuarios = [];
        if (this.filtro && this.filtro.email) {
            this.store.findByEmail(this.filtro.email).then(usuario => {
                this.$timeout(() => {
                    if (usuario != null) {
                        this.usuarios = [usuario];
                    } else {
                        this.usuarios = [];
                    }
                });
            });
        } else {
            this.store.getAll().then(usuarios => {
                this.$timeout(() => this.usuarios = usuarios);
            });
        }
    }
    
    excluir(usuario: Usuario) {
        if (this.authService.authentication.userName === usuario.email) {
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Operação inválida.')
                    .content('Você não pode excluir seu próprio usuário.')
                    .ariaLabel('Janela de operação inválida.')
                    .ok('Ok'));
            return;
        }
        
		var confirm: ng.material.IConfirmDialog = this.$mdDialog.confirm()
			.title('Excluir')
			.content(`Confirmar exclusão do usuário ${usuario.firstName}?`)
			.ok('Sim')
			.cancel('Não');
		
		this.$mdDialog.show(confirm).then(() => {
			this.store.remove(usuario).then(() => {
				this.$mdToast.show(
					this.$mdToast
						.simple()
						.position('top right')
						.content('Usuário excluído.')
						.hideDelay(3000));
                this.carregar();
			}, reason => {
                console.log(reason);
				this.$mdToast.show(
					this.$mdToast
						.simple()
						.position('top right')
						.content('Erro ao excluir o usuário.')
						.hideDelay(3000));
            });
		});
    }
}

class EditarUsuarioController {
    public usuario: Usuario;
    
    static $inject = [
        '$scope',
        '$routeParams',
        '$timeout',
        '$location',
        '$mdToast',
        '$mdDialog',
        'usuariosStore'
    ];
    
    constructor(private $scope: CriarUsuarioScope,
                private $routeParams: angular.route.IRouteParamsService,
                private $timeout: ng.ITimeoutService,
                private $location: ng.ILocationService,
                private $mdToast: angular.material.IToastService,
                private $mdDialog: angular.material.IDialogService,
                private store: UsuariosStore) {
        
        var id = $routeParams['id'];
        if (id) {
            store.getById(id).then(usuario => {
                if (usuario.roles && usuario.roles.length > 0) {
                    usuario.roleName = usuario.roles[0];
                }
                
                $timeout(() => this.usuario = usuario); 
            });
        }
    }
    
    salvar() {
        this.store.save(this.usuario).then(id => {
            this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Usuário salvo com sucesso.')
					.hideDelay(3000));
            
            this.listar();
        }, reason => {
            this.$scope.errors = reason && reason.data
                ? this.getErrorList(reason.data.modelState)
                : null;
            
            this.$mdToast.show(
                this.$mdToast
                    .simple()
                    .position('top right')
                    .content('Erro ao salvar o usuário.')
                    .hideDelay(3000));
        });
    }
    
    getErrorList(modelState: any): string[] {
        var result = [];
        for (var key in modelState) {
            result = result.concat(modelState[key]);
        }
        return result;
    }
    
    cancelar() {
        if (this.$scope.form.$dirty) {
            var confirm: angular.material.IConfirmDialog = this.$mdDialog.confirm()
                .title('Cancelar edição?')
                .content('Os dados inseridos não foram salvos. Deseja continuar?')
                .ok('Sim')
                .cancel('Não');

            this.$mdDialog.show(confirm).then(() => this.listar());
        } else {
            this.listar();
        }
    }
    
    listar() {
        this.$location.url('/usuarios');
    }
}

interface CriarUsuarioScope extends ng.IScope {
    form: any;
    message?: string;
    errors?: string[];
}

class CriarUsuarioController {
    public usuario: Usuario;
    
    static $inject = [
        '$scope',
        '$location',
        '$mdToast',
        '$mdDialog',
        'usuariosStore'
    ];
    
    constructor(private $scope: CriarUsuarioScope,
                private $location: ng.ILocationService,
                private $mdToast: angular.material.IToastService,
                private $mdDialog: angular.material.IDialogService,
                private store: UsuariosStore) {
        
    }
    
    salvar() {
        this.store.save(this.usuario).then(id => {
            this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Usuário salvo com sucesso.')
					.hideDelay(3000));
            
            this.listar();
        }, reason => {
            this.$scope.message = 'Erro ao salvar o usuário.';
            this.$scope.errors = reason && reason.data
                ? this.getErrorList(reason.data.modelState)
                : null;
            
            console.log(reason);
            this.$mdToast.show(
                this.$mdToast
                    .simple()
                    .content(this.$scope.message)
                    .hideDelay(3000)
                    .position('top right')
            );
        });
    }
    
    getErrorList(modelState: any): string[] {
        var result = [];
        for (var key in modelState) {
            result = result.concat(modelState[key]);
        }
        return result;
    }
    
    cancelar() {
        if (this.$scope.form.$dirty) {
            var confirm: angular.material.IConfirmDialog = this.$mdDialog.confirm()
                .title('Cancelar edição?')
                .content('Os dados inseridos não foram salvos. Deseja continuar?')
                .ok('Sim')
                .cancel('Não');

            this.$mdDialog.show(confirm).then(() => this.listar());
        } else {
            this.listar();
        }
    }
    
    listar() {
        this.$location.url('/usuarios');
    }
}

var app = angular.module('cantinaSimplesClienteApp')
       .controller('UsuariosController', UsuariosController)
       .controller('CriarUsuarioController', CriarUsuarioController)
       .controller('EditarUsuarioController', EditarUsuarioController);