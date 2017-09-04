
class FrenteCaixaController {
	public clientes: Cliente[];
	public produtos: Produto[];
	public searchText: string;
    public searchTextCliente: string;
	public selectedProduto: Produto;
	public selectedItens: ItemVenda[];
	
	public venda: Venda;
	
	public static $inject = [
		'$scope',
		'$timeout',
        '$mdToast',
		'clientesStore',
		'produtosStore',
        'vendasStore'
	];
	
	constructor(
			private $scope: ng.IScope,
			private $timeout: ng.ITimeoutService,
            private $mdToast: ng.material.IToastService,
			private clientesStore: ClientesStore,
			private produtosStore: ProdutosStore,
            private vendasStore: VendasStore) {
		
		this.carregarClientes();
		
		produtosStore.getAll().then(produtos => {
			$timeout(() => this.produtos = produtos);
		});
		
		this.venda = this.prepararNovaVenda();
		
		this.selectedItens = [];
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
    
    prepararNovaVenda(): Venda {
        var venda: Venda = {
            formaPagamento: 'dinheiro'
        };
        return venda;
    }
	
	queryProdutos(query: string): Produto[] {
		var results = query ? this.produtos.filter(this.createFilterFor(query)) : this.produtos;
		
		return results;
	}
	
	createFilterFor(query: string) {
		return produto => angular.lowercase(produto.nome).indexOf(angular.lowercase(query)) > -1;
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
	
	selectedProdutoChange(produto: Produto) {
		if (produto) {
			var item = {
				produto: produto,
				quantidade: 1,
				preco: produto.preco,
				subtotal: produto.preco
			};
			this.venda = this.venda || {};
			this.venda.itens = this.venda.itens || [];
			this.venda.itens.push(item);
			this.atualizarTotal();
            
            this.searchText = '';
            this.selectedProduto = undefined;
		}
	}
	
    clienteChange(cliente: Cliente) {
        if (cliente == null) {
            this.venda.formaPagamento = 'dinheiro';
        }
    }
    
	removerItem(item: ItemVenda) {
		this.venda.itens.splice(
			this.venda.itens.indexOf(item), 1);
		this.atualizarTotal();
	}
	
	emptySelectedItens(): boolean {
		return this.selectedItens == null || this.selectedItens.length === 0;
	}
	
	removerItens(itens: ItemVenda[]) {
		for (var item of itens) {
			var idx = this.venda.itens.indexOf(item);
			this.venda.itens.splice(idx, 1);
		}
        this.atualizarTotal();
	}
	
	atualizarSubtotal(item: ItemVenda) {
		item.subtotal = item.preco * item.quantidade;
		this.atualizarTotal();
	}
	
	atualizarTotal() {
		this.venda.total = this.venda.itens ?
            this.venda.itens.map(i => i.subtotal).reduce((a, b) => a + b, 0) || 0 : 0;
	}
	
	toggle<T>(item: T, list: T[]) {
		var idx = list.indexOf(item);
		if (idx > -1) list.splice(idx, 1);
		else list.push(item);
	}
	
	toggleAll<T>(items: T[], list: T[]) {
		if (this.existsAll(items, list)) {
			// remove
			for (var item of items) {
				var idx = list.indexOf(item);
				list.splice(idx, 1);
			}
		} else {
			// add
			for (var item of items) {
				var idx = list.indexOf(item);
				if (idx === -1) list.push(item);
			}
		}
	}
	
	exists<T>(item: T, list: T[]): boolean {
		return list.indexOf(item) > -1;
	}
	
	existsAll<T>(items: T[], list: T[]): boolean {
        if (!(items && list)) return false;
		if (items.length === 0) return false;
		for (var item of items) {
			if (!this.exists(item, list)) {
				return false;
			}
		}
		return true;
	}
    
    fecharVenda() {
        if (this.venda.itens == null || this.venda.itens.length === 0) {
            this.$mdToast.showSimple('Nenhum produto incluído.');
            return;
        }
        
        if (this.venda.cliente != null) {
            this.venda.idCliente = this.venda.cliente.id;
        }
        this.venda.itens.forEach(item => item.idProduto = item.produto.id);
        
        this.vendasStore.save(this.venda).then(id => {
            this.$timeout(() => {
                this.venda = this.prepararNovaVenda();
                this.searchTextCliente = '';
                this.carregarClientes();
             });
			
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Venda gravada com sucesso.')
					.hideDelay(3000));
        }).catch(reason => {
            console.log(reason);
            var msg = reason && reason.data && reason.data.exceptionMessage;
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content(msg || 'Erro ao gravar a venda.')
					.hideDelay(3000));
        });
    }
}

angular.module('cantinaSimplesClienteApp')
       .controller('FrenteCaixaController', FrenteCaixaController);