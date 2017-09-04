
interface FiltroListaProdutos {
	nome?: string;
}

class ListaProdutosController {
	items: Produto[];
	filtro: FiltroListaProdutos;
	
	public static $inject = [
		'produtosStore',
		'$timeout',
		'$location',
		'$mdDialog',
        '$mdToast'
	];
	
	constructor(
			private store: ProdutosStore,
			private $timeout: ng.ITimeoutService,
			private $location: ng.ILocationService,
			private $mdDialog: ng.material.IDialogService,
            private $mdToast: ng.material.IToastService) {
		this.items = [];
		store.getAll().then(produtos => {
            $timeout(() => {
                this.items = produtos;
			}, 0);
		});
	}
	
	plural(quantidade: number, formaSingular: string, formaPlural: string) {
		let forma = quantidade === 1 ? formaSingular : formaPlural;
		return `${quantidade} ${forma}`;
	}
	
	goToProduto(produto: Produto) {
		this.$location.path(`produtos/editar/${produto.id}`);
	}
	
	novo() {
		this.$location.url('produtos/criar');
	}
	
	excluir(produto: Produto) {
		let confirm: ng.material.IConfirmDialog = this.$mdDialog.confirm()
			.title('Excluir')
			.content('Deseja realmente excluir o produto?')
			.ok('Sim')
			.cancel('Não');
		
		this.$mdDialog.show(confirm).then(() => {
			this.store.remove(produto).then(() => {
				this.$timeout(() => {
					this.items.splice(
						this.items.indexOf(produto), 1);
				});
                
                this.$mdToast.show(
                    this.$mdToast
                        .simple()
                        .hideDelay(3000)
                        .content('Produto excluído com sucesso.')
                        .position('top right')
                );
			}).catch(reason => {
                console.log(reason);
                var message = reason && reason.data && reason.data.message
                    || 'Erro ao excluir o produto';
                
                this.$mdToast.show(
                    this.$mdToast
                        .simple()
                        .hideDelay(3000)
                        .content(message)
                        .position('top right')
                );
            });
		});
	}
	
	buscar(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.store.find(this.filtro.nome).then((produtos) => {
				this.$timeout(() => {
					this.items = produtos;
					resolve();
				});
			});
		});
	}
}

interface EditarProdutoScope extends ng.IScope {
	form: any;
}

class EditarProdutoController {
	produtoEmEdicao: Produto;
	
	public static $inject = [
		'produtosStore',
		'$scope',
		'$timeout',
		'$routeParams',
		'$location',
		'$mdToast',
		'$mdDialog'
	];
	
	constructor(
			private store: ProdutosStore,
			private $scope: EditarProdutoScope,
			private $timeout: ng.ITimeoutService,
			
			private $routeParams: angular.route.IRouteParamsService,
			private $location: angular.ILocationService,
			
			private $mdToast: angular.material.IToastService,
			private $mdDialog: angular.material.IDialogService) {
		
		if ($routeParams['id'] == null) {
            this.produtoEmEdicao = null;
        } else {
            var id = parseInt($routeParams['id'], 10);
            store.getById(id).then(contato =>
                $timeout(() =>
                    this.produtoEmEdicao = contato));
        }
	}
	
	salvar() {
		this.store.save(this.produtoEmEdicao).then(() => {
			this.$timeout(() => this.produtoEmEdicao = null);
			
			this.$mdToast.show(
				this.$mdToast
					.simple()
					.position('top right')
					.content('Produto salvo com sucesso.')
					.hideDelay(3000));
			
			this.goToIndex();
		});
	}
	
    cancelar() {
        if (this.$scope.form.$dirty) {
            var confirm: angular.material.IConfirmDialog = this.$mdDialog.confirm()
                .title('Cancelar edição?')
                .content('Os dados inseridos não foram salvos. Deseja continuar?')
                .ok('Sim')
                .cancel('Não');

            this.$mdDialog.show(confirm).then(() => this.goToIndex());
        } else {
            this.goToIndex();
        }
    }
	
	goToIndex() {
		this.$location.url('/produtos');
	}
}

angular.module('cantinaSimplesClienteApp')
	.controller('ListaProdutosController', ListaProdutosController)
	.controller('EditarProdutoController', EditarProdutoController);