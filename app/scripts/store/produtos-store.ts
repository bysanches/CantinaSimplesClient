
function createProdutosStore($http, $q, serviceBase): ProdutosStore {
    return new RestApiProdutosStore($http, $q, serviceBase);
}

class RestApiProdutosStore implements ProdutosStore {
    
    constructor(private $http: ng.IHttpService,
                private $q: ng.IQService,
                private serviceBase: string) {}
    
	getAll(): Promise<Produto[]> {
        return new Promise((resolve, reject) => { 
            this.$http.get<Produto[]>(this.serviceBase + 'api/produtos').then<Produto[]>(result => {
                resolve(result.data);
                return result.data;
            }).catch(reason => reject(reason));
        });
	}
	
	getById(id: number): Promise<Produto> {
        return new Promise((resolve, reject) => {
            this.$http.get<Produto>(this.serviceBase + `api/produtos/${id}`).then<Produto>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
	}
	
	save(entity: Produto): Promise<number> {
        return new Promise((resolve, reject) => {
            if (entity.id == null) {
                this.$http.post<Produto>(this.serviceBase + 'api/produtos', entity).then<Produto>(result => {
                    resolve(result.data.id);
                    return result.data;
                }, reason => reject(reason));
            } else {
                this.$http.put<Produto>(this.serviceBase + `api/produtos/${entity.id}`, entity).then<Produto>(result => {
                    resolve(entity.id);
                    return entity;
                }, reason => reject(reason));
            }
        });
	}
	
	remove(entity: Produto): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.$http.delete(this.serviceBase + `api/produtos/${entity.id}`).then(result => {
                resolve();
            }, reason => reject(reason));
        });
	}
	
	find(nome: string): Promise<Produto[]> {
        
        return new Promise((resolve, reject) => { 
            this.$http<Produto[]>({
                url: this.serviceBase + 'api/produtos',
                params: {nome: nome},
                method: 'GET'
            }).then<Produto[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
	}
}

class MockProdutosStore implements ProdutosStore {
	private static previousId: number = 1000;
	
	public static produtos: Produto[] = [
		{ id: 9991, nome: 'Halls', preco: 2 },
		{ id: 9992, nome: 'Refrigerante lata', preco: 3.5 },
		{ id: 99945, nome: 'Coxinha', preco: 4.5 }
	];
	
	getAll(): Promise<Produto[]> {
		var result = Array.prototype.slice.call(MockProdutosStore.produtos);
		return new Promise((resolve, reject) => {
			resolve(result);
		});
	}
	
	getById(id: number): Promise<Produto> {
		let query = MockProdutosStore.produtos.filter(p => p.id === id);
		let p = query.length > 0 ? query[0] : null;
		
		return new Promise((resolve, reject) => {
			resolve(p);
		});
	}
	
	save(entity: Produto): Promise<number> {
		let exists: boolean = MockProdutosStore.produtos.filter(p => p.id === entity.id).length > 0;
		if (!exists) {
			entity.id = ++MockProdutosStore.previousId;
			MockProdutosStore.produtos.push(entity);
		}
		return new Promise((resolve, reject) => { resolve(entity.id) });
	}
	
	remove(entity: Produto): Promise<void> {
		MockProdutosStore.produtos.splice(
			MockProdutosStore.produtos.indexOf(entity), 1);
			
		return new Promise<void>((resolve, reject) => resolve());
	}
	
	find(nome: string): Promise<Produto[]> {
		let result = MockProdutosStore.produtos.filter(p => p.nome.toLowerCase().search(new RegExp(nome.toLowerCase())) > -1);
		return new Promise<Produto[]>((resolve, reject) => resolve(result));
	}
}

for (var i = 0; i < 1000; i++) {
    var p = { id: i, nome: 'Produto #' + i, preco: 1.5 };
	MockProdutosStore.produtos.push(p);
}