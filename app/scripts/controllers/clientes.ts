
interface ClientesScope extends ng.IScope {
	form: any;
}

interface FiltroClientes {
	nome?: string;
	email?: string;
	documento?: string;
}

class ClientesController {
    public clientes: Cliente[];
	public filtro: FiltroClientes;
	
	public static $inject = [
		'clientesStore',
		'$timeout',
		'$location',
		'$mdDialog',
		'$mdToast'
	];
	
    constructor(
			private store: ClientesStore,
			private $timeout: ng.ITimeoutService,
			private $location: ng.ILocationService,
			private $mdDialog: ng.material.IDialogService,
			private $mdToast: ng.material.IToastService) {
		this.carregarClientes();
	}
    
    carregarClientes() {
		this.store.getAll().then(clientes => {
			this.$timeout(() => this.clientes = clientes, 0);
		}).catch(reason => {
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao carregar os clientes.')
					.hideDelay(3000));
        });
    }
	
	filtrar() {
		if (this.filtro) {
			this.store.find(this.filtro.nome, this.filtro.email, this.filtro.documento).then(result => {
				this.$timeout(() => this.clientes = result);
			});
		}
	}
	
	novo() {
		this.$location.url('/clientes/criar');
	}
	
	editar(cliente: Cliente) {
		this.$location.url(`/clientes/editar/${cliente.id}`);
	}
	
	excluir(cliente: Cliente) {
		var confirm: ng.material.IConfirmDialog = this.$mdDialog.confirm()
			.title('Excluir')
			.content(`Confirmar exclusão do cliente ${cliente.nome}?`)
			.ok('Sim')
			.cancel('Não');
		
		this.$mdDialog.show(confirm).then(() => {
			this.store.remove(cliente).then(() => {
				this.$mdToast.show(
					this.$mdToast
						.simple()
						.position('top right')
						.content('Cliente excluído.')
						.hideDelay(3000));
                
                var idx = this.clientes.indexOf(cliente);
                this.clientes.splice(idx, 1);
			}).catch(reason => {
                var message = reason && reason.data && reason.data.message
                    || 'Erro ao excluir o cliente.';
                
				this.$mdToast.show(
					this.$mdToast
						.simple()
						.position('top right')
						.content(message)
						.hideDelay(3000));
            });
		});
	}
}

class EditarClienteController {
	public cliente: Cliente;
    public usuarios: Usuario[];
	
	public static $inject = [
		'clientesStore',
        'usuariosStore',
		'$scope',
		'$routeParams',
		'$timeout',
		'$location',
		'$mdDialog',
		'$mdToast'
	];
	
    constructor(
			private store: ClientesStore,
            private usuariosStore: UsuariosStore,
			private $scope: ClientesScope,
			private $routeParams: angular.route.IRouteParamsService,
			private $timeout: ng.ITimeoutService,
			private $location: ng.ILocationService,
			private $mdDialog: ng.material.IDialogService,
			private $mdToast: ng.material.IToastService) {
        this.carregarUsuarios();
        
		if ($routeParams['id'] != null) {
			var id = parseInt($routeParams['id'], 10);
			store.getById(id).then(cliente => {
                this.cliente = cliente;
                if (cliente.responsavel != null)
                    cliente.idResponsavel = cliente.responsavel.id;
                if (typeof cliente.nascimento === 'string') {
                    cliente.nascimento = new Date(<string>cliente.nascimento);
                }
            });
		}
	}
    
    carregarUsuarios() {
        this.usuariosStore.findByPerfil('Responsavel').then(usuarios => {
            this.$timeout(() => this.usuarios = usuarios);
        }).catch(reason => {
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao carregar os usuários.')
					.hideDelay(3000));
        });
    }
	
	salvar() {
		this.store.save(this.cliente).then(() => {
			this.$timeout(() => this.cliente = null);
			
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Cliente salvo com sucesso.')
					.hideDelay(3000));
			
			this.listar();
		}).catch(reason => {
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao salvar o cliente.')
					.hideDelay(3000));
        });
	}
	
	cancelar() {
        if (this.$scope.form.$dirty) {
            var confirm: ng.material.IConfirmDialog = this.$mdDialog.confirm()
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
		this.$location.url('/clientes');
	}
}

app.controller('ClientesController', ClientesController);
app.controller('EditarClienteController', EditarClienteController);