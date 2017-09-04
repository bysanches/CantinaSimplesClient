

class MovimentosEstoqueController {
	public movimentos: MovimentoEstoque[];
    
	public static $inject = [
		'movimentosEstoqueService',
        'paginator',
        '$scope',
		'$location',
		'$mdDialog',
        '$mdToast'
	];
	
	constructor(
			private movimentosEstoqueService: MovimentosEstoqueService,
            private paginator: Paginator,
            private $scope: ng.IScope,
			private $location: ng.ILocationService,
			private $mdDialog: ng.material.IDialogService,
            private $mdToast: ng.material.IToastService) {
        this.paginator.pageSize = 10;
        
        $scope.$watch(() => this.paginator.page, (newValue, oldValue, scope) => {
            this.carregarMovimentos();
        });
    }
    
    carregarMovimentos() {
		this.movimentosEstoqueService.getPage(this.paginator.page, this.paginator.pageSize).then(result => {
            this.movimentos = result.data.data;
            this.paginator.totalCount = result.data.totalCount;
		}).catch(reason => {
            console.log(reason);
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao carregar os movimentos de estoque.')
					.hideDelay(3000));
        });
    }
    
    classFor(quantidade: number) {
        return quantidade > 0 ? 'entrada' : 'saida';
    }
    
    novo() {
        this.$location.url('/estoque/criar');
    }
    
    excluir(movimento: MovimentoEstoque) {
		var confirm: ng.material.IConfirmDialog = this.$mdDialog.confirm()
			.title('Excluir')
			.content(`Confirmar exclusão do movimento de ${movimento.quantidade} unidades de ${movimento.produto.nome}?`)
			.ok('Sim')
			.cancel('Não');
		
		this.$mdDialog.show(confirm).then(() => {            
			this.movimentosEstoqueService.remove(movimento).then(() => {
                var idx = this.movimentos.indexOf(movimento);
                this.movimentos.splice(idx, 1);
                
				this.$mdToast.show(
					this.$mdToast
						.simple()
						.position('top right')
						.content('Movimento excluído.')
						.hideDelay(3000));
			}).catch(reason => {
                console.log(reason);
                
                var message = reason && reason.data && reason.data.message
                    || 'Erro ao excluir o movimento de estoque.';
                
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

class CriarMovimentoEstoqueController {
    public produtos: Produto[];
    public model: MovimentoEstoque;
    public erros: string[];
    
    static $inject = [
        '$timeout',
        '$location',
        '$mdToast',
        'produtosStore',
        'movimentosEstoqueStore'
    ];
    
    constructor(private $timeout: ng.ITimeoutService,
                private $location: ng.ILocationService,
                private $mdToast: ng.material.IToastService,
                private produtosStore: ProdutosStore,
                private movimentosEstoqueStore: MovimentosEstoqueStore) {
        this.model = {};
        this.produtos = [];
        this.carregarProdutos();
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
    
	query(query: string): Produto[] {
		var results = query ? this.produtos.filter(this.createFilterFor(query)) : this.produtos;
		return results;
	}
	
	createFilterFor(query: string) {
		return produto => angular.lowercase(produto.nome).indexOf(angular.lowercase(query)) > -1;
	}
    
    produtoChange(produto: Produto) {
        this.model.idProduto = produto.id;
    }
    
    salvar() {
		this.movimentosEstoqueStore.save(this.model).then(id => {
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Movimento salvo com sucesso.')
					.hideDelay(3000));
            this.listar();
		}).catch(reason => {
            console.log(reason);
            
            this.erros = reason && reason.data && reason.data.modelState
                ? this.getErros(reason.data.modelState)
                : null;
            
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Erro ao salvar o movimento de estoque.')
					.hideDelay(3000));
        });
    }
    
    getErros(modelState: {[key: string]: string[]}): string[] {
        var result = [];
        for (var key in modelState) {
            result = result.concat(modelState[key]);
        }
        return result;
    }
    
    listar() {
        this.$location.url('/estoque');
    }
}


angular.module('cantinaSimplesClienteApp')
       .controller('MovimentosEstoqueController', MovimentosEstoqueController)
       .controller('CriarMovimentoEstoqueController', CriarMovimentoEstoqueController);