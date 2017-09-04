
class RestricoesController {
    
    public clientes: Cliente[];
    public cliente: Cliente;
    
    public produtos: Produto[];
    
    static $inject = [
        '$timeout',
        '$location',
        '$mdToast',
        'clientesStore',
        'produtosStore'
    ];
    
    constructor(private $timeout: ng.ITimeoutService,
                private $location: ng.ILocationService,
                private $mdToast: ng.material.IToastService,
                private clientesStore: ClientesStore,
                private produtosStore: ProdutosStore) {
        this.carregarClientes();
        this.carregarProdutos();
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
    
    carregarProdutos() {
		this.produtosStore.getAll().then(produtos => {
			this.$timeout(() => this.produtos = produtos, 0);
		}).catch(reason => {
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao carregar os produtos.')
					.hideDelay(3000));
        });
    }
    
    clienteChange(cliente: Cliente) {
        if (cliente != null) {
            this.carregarRestricoes();
        }
    }
    
    carregarRestricoes() {
        this.clientesStore.getRestricoes(this.cliente.id).then(restricoes => {
            this.$timeout(() => this.cliente.restricoes = restricoes);
        }).catch(reason => {
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao carregar as restrições.')
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
	
	toggle(item: number, list: number[]) {
        if (list == null) return;
		var idx = list.indexOf(item);
		if (idx > -1) {
            list.splice(idx, 1);
            this.removeRestricao(item);
        } else {
            list.push(item);
            this.addRestricao(item);
        }
	}
	
	exists<T>(item: T, list: T[]): boolean {
		return list.indexOf(item) > -1;
	}
    
    addRestricao(idProduto: number) {
        this.clientesStore.addRestricao(this.cliente.id, idProduto).catch(reason => {
            var idx = this.cliente.restricoes.indexOf(idProduto);
            this.cliente.restricoes.splice(idx, 1);
            
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao adicionar a restrição.')
					.hideDelay(3000));
        });
    }
    
    removeRestricao(idProduto: number) {
        this.clientesStore.removeRestricao(this.cliente.id, idProduto).catch(reason => {
            this.cliente.restricoes.push(idProduto);
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao remover a restrição.')
					.hideDelay(3000));
        });
    }
    
    plural(num: number, formaSingular: string, formaPlural) {
        return `${num} ${num === 1 ? formaSingular : formaPlural}`;
    }
}


angular.module('cantinaSimplesClienteApp')
       .controller('RestricoesController', RestricoesController);