
interface TrocarSenhaModel {
    senhaAtual: string;
    novaSenha: string;
    confirmacaoSenha: string;
}

class TrocarSenhaController {
    
    public model: TrocarSenhaModel;
    public erros: string[];
    
    static $inject = [
        '$mdToast',
        '$location',
        'usuariosStore'
    ];
    
    constructor(private $mdToast: ng.material.IToastService,
                private $location: ng.ILocationService,
                private store: UsuariosStore) {
        
    }
    
    trocarSenha() {
        this.store.changePassword(this.model.senhaAtual, this.model.novaSenha, this.model.confirmacaoSenha)
            .then(() => {
                this.$mdToast.show(
                    this.$mdToast
                        .simple()
                        .position('top right')
                        .content('Senha alterada com sucesso.')
                        .hideDelay(3000));
                
                this.$location.url('/');
            }).catch(reason => {
                console.log(reason);
                this.erros = reason && reason.data && reason.data.modelState
                    ? this.getErros(reason.data.modelState)
                    : [];
                
                this.$mdToast.show(
                    this.$mdToast
                        .simple()
                        .position('top right')
                        .content(reason && reason.message || 'Erro ao trocar senha.')
                        .hideDelay(3000));
            });
    }
    
    getErros(modelState: any): string[] {
        var result = [];
        for (var key in modelState) {
            result = result.concat(modelState[key]);
        }
        return result;
    }
}

angular.module('cantinaSimplesClienteApp')
       .controller('TrocarSenhaController', TrocarSenhaController);