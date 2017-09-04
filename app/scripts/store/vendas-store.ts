
class RestApiVendasStore implements VendasStore {
    
    constructor(private $http: ng.IHttpService,
                private serviceBase: string) {}
    
	getAll(): Promise<Venda[]> {
        return new Promise<Venda[]>((resolve, reject) => {
            this.$http.get<Venda[]>(this.serviceBase + 'api/vendas').then<Venda[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
	getById(id: number): Promise<Venda> {
        return new Promise<Venda>((resolve, reject) => {
            var url = `${this.serviceBase}api/vendas/${id}`;
            this.$http.get<Venda>(url).then<Venda>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
	save(entity: Venda): Promise<number> {
        return new Promise((resolve, reject) => {
            this.$http.post<Venda>(this.serviceBase + 'api/vendas', entity).then<Venda>(result => {
                resolve((<Venda>result.data).id);
                return result.data;
            }, reason => reject(reason));
        });
    }
	remove(entity: Venda): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var url = `${this.serviceBase}api/vendas/${entity.id}`;
            this.$http.delete(url).then(result => {
                resolve();
                return result.data;
            }, reason => reject(reason));
        });
    }
    find(nome?: string, de?: Date, ate?: Date): Promise<Venda[]> {
        return new Promise<Venda[]>((resolve, reject) => {
            this.$http<Venda[]>({
                url: this.serviceBase + 'api/vendas',
                method: 'GET',
                params: {nomeCliente: nome, dataDe: de, dataAte: ate}
            }).then<Venda[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
}

class MockVendasStore implements VendasStore {
    
    static vendas: Venda[] = [
        {
            cliente: {
                id: 1,
                nome: 'Ana'
            },
            data: new Date(),
            itens: [
                {
                    produto: {
                        id: 1,
                        nome: 'Halls',
                        preco: 2
                    },
                    preco: 2,
                    quantidade: 1,
                    subtotal: 2
                }
            ],
            total: 2
        },
        {
            cliente: {
                id: 2,
                nome: 'Kya'
            },
            data: new Date(),
            itens: [
                {
                    produto: {
                        id: 45,
                        nome: 'Coxinha',
                        preco: 4.5
                    },
                    preco: 4.5,
                    quantidade: 2,
                    subtotal: 9
                }
            ],
            total: 9
        }
    ];
    
	getAll(): Promise<Venda[]> {
        var vendas = Array.prototype.slice.call(MockVendasStore.vendas);
        return new Promise((resolve, reject) => resolve(vendas));
    }
	getById(id: number): Promise<Venda> {
        var venda = MockVendasStore.vendas.filter(v => v.id === id).shift();
        return new Promise((resolve, reject) => resolve(venda));
    }
	save(entity: Venda): Promise<number> {
        if (entity.id == null) {
            var lastId = Math.max.apply(Math, MockVendasStore.vendas.map(v => v.id));
            entity.id = lastId + 1;
            MockVendasStore.vendas.push(entity);
        }
        return new Promise((resolve, reject) => resolve(entity.id));
    }
	remove(entity: Venda): Promise<void> {
        var idx = MockVendasStore.vendas.indexOf(entity);
        if (idx > -1) MockVendasStore.vendas.splice(idx, 1);
        return new Promise<void>((resolve, reject) => resolve());
    }
    find(nome?: string, de?: Date, ate?: Date): Promise<Venda[]> {
        var vendas = MockVendasStore.vendas;
        vendas = vendas.filter(venda => {
            if (nome) {
                var idx = angular.lowercase(venda.cliente.nome).indexOf(angular.lowercase(nome));
                if (idx === -1) {
                    return false;
                }
            }
            
            if (de && venda.data < de) {
                return false;
            }
            
            if (ate && venda.data > ate) {
                return false;
            }
            
            return true;
        });
        console.log('rodando!');
        return new Promise((resolve, reject) => resolve(vendas));
    }
}