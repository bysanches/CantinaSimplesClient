
class MovimentosEstoqueService {
    
    static $inject = [
        '$http',
        'serviceBase'
    ];
    
    constructor(private $http: ng.IHttpService,
                private serviceBase: string) {
    }
    
    getAll(): ng.IHttpPromise<MovimentoEstoque[]> {
        var url = `${this.serviceBase}api/movimentosestoque`;
        return this.$http.get<MovimentoEstoque[]>(url);
    }
    
    getPage(page: number = 1, pageSize: number = 10): ng.IHttpPromise<PagedResult<MovimentoEstoque>> {
        var url = `${this.serviceBase}api/movimentosestoque/paged`;
        return this.$http.get<PagedResult<MovimentoEstoque>>(url, {
            params: {page, pageSize}
        });
    }
    remove(entity: MovimentoEstoque): ng.IHttpPromise<void> {
        var url = `${this.serviceBase}api/movimentosestoque/${entity.id}`;
        return this.$http.delete<void>(url);
	}
}

app.service('movimentosEstoqueService', MovimentosEstoqueService);

class RestApiMovimentosEstoqueStore implements MovimentosEstoqueStore {
	
    constructor(private $http: ng.IHttpService,
                private serviceBase: string) {
    }
    
    getAll(): Promise<MovimentoEstoque[]> {
		return new Promise((resolve, reject) => {
            var url = `${this.serviceBase}api/movimentosestoque`;
            this.$http.get<MovimentoEstoque[]>(url).then<MovimentoEstoque[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
	}
    getPage(page: number = 1, pageSize: number = 10): Promise<PagedResult<MovimentoEstoque>> {
		return new Promise((resolve, reject) => {
            var url = `${this.serviceBase}api/movimentosestoque/paged`;
            this.$http<PagedResult<MovimentoEstoque>>({
                url,
                method: 'GET',
                params: {page, pageSize}
            }).then<PagedResult<MovimentoEstoque>>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
	getById(id: number): Promise<MovimentoEstoque> {
		return new Promise((resolve, reject) => {
            var url = `${this.serviceBase}api/movimentosestoque/${id}`;
            this.$http.get<MovimentoEstoque>(url).then<MovimentoEstoque>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
	}
	save(entity: MovimentoEstoque): Promise<number> {
		if (entity.id == null) {
            return new Promise((resolve, reject) => {
                var url = `${this.serviceBase}api/movimentosestoque/`;
                this.$http.post<MovimentoEstoque>(url, entity).then<MovimentoEstoque>(result => {
                    resolve(result.data.id);
                    return result.data;
                }, reason => reject(reason));
            });
		} else {
            return new Promise((resolve, reject) => {
                var url = `${this.serviceBase}api/movimentosestoque/${entity.id}`;
                this.$http.put(url, entity).then(result => {
                    resolve(entity.id);
                    return result;
                }, reason => reject(reason));
            });
        }
	}
	remove(entity: MovimentoEstoque): Promise<void> {
		return new Promise<void>((resolve, reject) => {
            var url = `${this.serviceBase}api/movimentosestoque/${entity.id}`;
            this.$http.delete(url).then(result => {
                resolve();
                return result;
            }, reason => reject(reason));
        });
	}
}

class MockMovimentosEstoqueStore implements MovimentosEstoqueStore {
	
	static produto: Produto = {
		id: 3,
		nome: 'Salgado',
		preco: 3.5
	};
	static movimentos: MovimentoEstoque[] = [
		{id: 1, data: new Date('2015-10-27T18:04:04.946Z'), produto: MockMovimentosEstoqueStore.produto, idProduto: 3, quantidade: 1},
		{id: 2, data: new Date('2015-10-27T18:04:04.946Z'), produto: MockMovimentosEstoqueStore.produto, idProduto: 3, quantidade: 1},
		{id: 3, data: new Date('2015-10-27T18:04:04.946Z'), produto: MockMovimentosEstoqueStore.produto, idProduto: 3, quantidade: -1},
		{id: 4, data: new Date('2015-10-27T18:04:04.946Z'), produto: MockMovimentosEstoqueStore.produto, idProduto: 3, quantidade: -1},
		{id: 5, data: new Date('2015-10-27T18:04:04.946Z'), produto: MockMovimentosEstoqueStore.produto, idProduto: 3, quantidade: 1},
		{id: 6, data: new Date('2015-10-27T18:04:04.946Z'), produto: MockMovimentosEstoqueStore.produto, idProduto: 3, quantidade: 1}
	];
	
	getAll(): Promise<MovimentoEstoque[]> {
		var movimentos = Array.prototype.slice.call(MockMovimentosEstoqueStore.movimentos);
		return new Promise((resolve, reject) => resolve(movimentos));
	}
    getPage(page: number = 1, pageSize: number = 10): Promise<PagedResult<MovimentoEstoque>> {
        var movimentos = MockMovimentosEstoqueStore.movimentos.slice((page - 1) * pageSize, pageSize);
        return new Promise((resolve, reject) => resolve({
            data: movimentos,
            totalCount: MockMovimentosEstoqueStore.movimentos.length
        }));
    }
	getById(id: number): Promise<MovimentoEstoque> {
		var movimento = MockMovimentosEstoqueStore.movimentos.filter(m => m.id === id).shift();
		return new Promise((resolve, reject) => resolve(movimento));
	}
	save(entity: MovimentoEstoque): Promise<number> {
		if (entity.id == null) {
			var nextId = Math.max.apply(Math, MockMovimentosEstoqueStore.movimentos.map(m => m.id)) + 1;
			entity.id = nextId;
            entity.data = new Date();
			MockMovimentosEstoqueStore.movimentos.push(entity);
		}
		return new Promise((resolve, reject) => resolve(entity.id));
	}
	remove(entity: MovimentoEstoque): Promise<void> {
		var idx = MockMovimentosEstoqueStore.movimentos.indexOf(entity);
		if (idx > -1) {
			MockMovimentosEstoqueStore.movimentos.splice(idx, 1);
		}
		return new Promise<void>((resolve, reject) => resolve());
	}
}