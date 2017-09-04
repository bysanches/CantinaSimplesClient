

class RecargaController {
    
    public clientes: Cliente[];
    public model: RecargaModel;
    
    static $inject = [
        '$timeout',
        '$location',
        '$mdToast',
        'clientesStore',
        'recargaService'
    ];
    
    constructor(private $timeout: ng.ITimeoutService,
                private $location: ng.ILocationService,
                private $mdToast: ng.material.IToastService,
                private clientesStore: ClientesStore,
                private recargaService: RecargaService) {
        this.carregarClientes();
    }
    
    carregarClientes() {
		this.clientesStore.getAll().then(clientes => {
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
    
    queryClientes(query: string) {
        var results = query
            ? this.clientes.filter(this.createFilterForClientes(query))
            : this.clientes;
        
        return results;
    }
    
    createFilterForClientes(query: string) {
        return cliente => {
            var label = `${cliente.nome} - ${cliente.documento}`;
            label = angular.lowercase(label);
            return label.indexOf(angular.lowercase(query)) > -1;
        };
    }
    
    clienteChange(cliente: Cliente) {
        this.model = this.model || {};
        this.model.idCliente = cliente.id;
    }
    
    salvar() {
        this.recargaService.save(this.model).then(() => {
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Recarga efetuada com sucesso.')
					.hideDelay(3000));
            
            this.$location.url('/');
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
}


angular.module('cantinaSimplesClienteApp')
       .controller('RecargaController', RecargaController);