function createClientesStore($http, $q, serviceBase): ClientesStore {
    return new RestApiClientesStore($http, $q, serviceBase);
}

class RestApiClientesStore implements ClientesStore {
    
    constructor(private $http: ng.IHttpService,
                private $q: ng.IQService,
                private serviceBase: string) {}
    
	getAll(): Promise<Cliente[]> {
        return new Promise((resolve, reject) => { 
            this.$http.get<Cliente[]>(this.serviceBase + 'api/clientes').then<Cliente[]>(result => {
                resolve(result.data);
                return result.data;
            }).catch(reason => reject(reason));
        });
	}
	
	getById(id: number): Promise<Cliente> {
        return new Promise((resolve, reject) => {
            this.$http.get<Cliente>(this.serviceBase + `api/clientes/${id}`).then<Cliente>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
	}
	
	save(entity: Cliente): Promise<number> {
        return new Promise((resolve, reject) => {
            if (entity.id == null) {
                this.$http.post<Cliente>(this.serviceBase + 'api/clientes', entity).then<Cliente>(result => {
                    resolve(result.data.id);
                    return result.data;
                }, reason => reject(reason));
            } else {
                this.$http.put<Cliente>(this.serviceBase + `api/clientes/${entity.id}`, entity).then<Cliente>(result => {
                    resolve(entity.id);
                    return entity;
                }, reason => reject(reason));
            }
        });
	}
	
	remove(entity: Cliente): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.$http.delete(this.serviceBase + `api/clientes/${entity.id}`).then(result => {
                resolve();
            }, reason => reject(reason));
        });
	}
	
	find(nome?: string, email?: string, documento?: string): Promise<Cliente[]> {
        
        return new Promise((resolve, reject) => { 
            this.$http<Cliente[]>({
                url: this.serviceBase + 'api/clientes',
                params: {nome, email, documento},
                method: 'GET'
            }).then<Cliente[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
	}
    
    getRestricoes(id: number): Promise<number[]> {
        return new Promise((resolve, reject) => {
            var url = `${this.serviceBase}api/clientes/${id}/restricoes`;
            this.$http.get<number[]>(url).then<number[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
    
    addRestricao(idCliente: number, idProduto: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var url = `${this.serviceBase}api/clientes/${idCliente}/restricoes/${idProduto}`;
            this.$http.post(url, {}).then(result => {
                resolve();
                return result;
            }, reason => reject(reason));
        });
    }
    
    removeRestricao(idCliente: number, idProduto: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var url = `${this.serviceBase}api/clientes/${idCliente}/restricoes/${idProduto}`;
            this.$http.delete(url, {}).then(result => {
                resolve();
                return result;
            }, reason => reject(reason));
        });
    }
}

class MockClientesStore implements ClientesStore {
	
	static clientes: Cliente[] = [
		{ id: 1, nome: 'Ana' },
		{ id: 2, nome: 'Kya' }
	];
	
	find(nome?: string, email?: string, documento?: string): Promise<Cliente[]> {
		var clientes = MockClientesStore.clientes.filter(c => {
			if (nome && c.nome.toLowerCase().indexOf(nome.toLowerCase()) === -1) {
				return false;
			}
			
			if (email && c.email !== email) {
				return false;
			}
			
			if (documento && c.documento !== documento) {
				return false;
			}
			
			return true;
		});
		
		return new Promise((resolve, reject) => {
			resolve(clientes);
		});
	}
	
	getAll(): Promise<Cliente[]> {
		var clientes = MockClientesStore.clientes = Array.prototype.slice.call(MockClientesStore.clientes);
		
		return new Promise((resolve, reject) => {
			resolve(clientes);
		});
	}
	
	getById(id: number): Promise<Cliente> {
		var cliente = MockClientesStore.clientes.filter(c => c.id === id).shift();
		
		return new Promise((resolve, reject) => {
			resolve(cliente);
		});
	}
	
	save(entity: Cliente): Promise<number> {
		return entity.id ? this.atualizar(entity) : this.criar(entity);
	}
	
	private criar(entity: Cliente) {
		var ids = MockClientesStore.clientes.map(c => c.id);
		var nextId = Math.max.apply(Math, ids) + 1;
		
		return new Promise((resolve, reject) => {
			entity.id = nextId;
			MockClientesStore.clientes.push(entity);
			resolve(nextId);
		});
	}
	
	private atualizar(entity: Cliente) {
		return new Promise((resolve, reject) => {
			resolve(entity.id);
		});
	}
	
	remove(entity: Cliente): Promise<void> {
		MockClientesStore.clientes.splice(
			MockClientesStore.clientes.indexOf(entity), 1);
			
		return new Promise<void>((resolve, reject) => resolve());
	}
    
    getRestricoes(id: number): Promise<number[]>{
        return new Promise((resolve, reject) => resolve([]));
    }
    
    addRestricao(idCliente: number, idProduto: number): Promise<void> {
        throw 'not implemented';
    }
    
    removeRestricao(idCliente: number, idProduto: number): Promise<void> {
        throw 'not implemented';
    }
}