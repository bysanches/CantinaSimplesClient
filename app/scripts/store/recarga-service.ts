
interface RecargaModel {
    cliente?: Cliente;
    idCliente?: number;
    valor?: number;
}

interface RecargaService {
    save(recarga: RecargaModel): Promise<void>;
}

class RestApiRecargaService implements RecargaService {
    
    constructor(private $http: ng.IHttpService,
                private serviceBase: string) {}
    
    save(recarga: RecargaModel): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var url = `${this.serviceBase}api/recargas`;
            this.$http.post(url, {
                idCliente: recarga.idCliente,
                valor: recarga.valor
            }).then(result => {
                resolve();
                return result;
            }, reason => reject(reason));
        });
    }
}