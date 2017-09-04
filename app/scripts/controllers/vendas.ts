
class VendasController {
    public vendas: Venda[];
    public filtro;
    public total: number;
    
    static $inject = [
        '$timeout',
        'vendasStore'
    ];
    
    constructor(private $timeout,
                private store: VendasStore) {
        this.filtro = {
            de: new Date(),
            ate: new Date()
        };
        store.getAll().then(vendas => {
            $timeout(() => {
                 this.vendas = vendas;
                 this.total = this.calcularTotal();
            });
        });
    }
    
    calcularTotal() {
        if (this.vendas != null && this.vendas.length > 0) {
            return this.vendas.map(v => v.total).reduce((a, b) => a + b);
        }
        return 0;
    }
    
    filtrar() {
        if (this.filtro) {
            this.total = 0;
            this.store.find(this.filtro.nome, this.filtro.de, this.filtro.ate).then(vendas => {
                this.$timeout(() => {
                    this.vendas = vendas;
                    this.total = this.calcularTotal();
                });
            });
        }
    }
}

angular.module('cantinaSimplesClienteApp')
       .controller('VendasController', VendasController);