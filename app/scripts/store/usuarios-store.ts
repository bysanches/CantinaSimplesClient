
class RestApiUsuariosStore implements UsuariosStore {
    
    constructor(private $http: ng.IHttpService,
                private $q: ng.IQService,
                private serviceBase: string) {}
    
	getAll(): Promise<Usuario[]>{
        return new Promise((resolve, reject) => {
            this.$http<Usuario[]>({
                method: 'GET',
                url: this.serviceBase + 'api/accounts/users'
            }).then<Usuario[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
	getById(id: string): Promise<Usuario> {
        return new Promise((resolve, reject) => {
            this.$http.get<Usuario>(`${this.serviceBase}api/accounts/user/${id}`).then<Usuario>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
	save(entity: Usuario): Promise<string> {
        if (entity.id == null) {
            return new Promise((resolve, reject) => {
                this.$http.post(this.serviceBase + 'api/accounts/create', entity).then<Usuario>(result => {
                    resolve((<Usuario>result.data).id);
                    return result.data;
                }, reason => reject(reason));
            });
        } else {
            return new Promise((resolve, reject) => {
                var url = `${this.serviceBase}api/accounts/edit`;
                this.$http.put(url, entity).then(result => {
                    resolve(entity.id);
                    return result.data;
                }, reason => reject(reason));
            });
        }
    }
	remove(entity: Usuario): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var url = `${this.serviceBase}api/accounts/user/${entity.id}`;
            this.$http.delete(url).then(result => {
                resolve();
            }, reason => reject(reason));
        });
    }
    findByEmail(email: string): Promise<Usuario> {
        return new Promise((resolve, reject) => {
            this.$http<Usuario>({
                method: 'GET',
                url: `${this.serviceBase}api/accounts/userByEmail/`,
                params: {email}
            }).then<Usuario>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
    findByPerfil(perfil: string): Promise<Usuario[]> {
        return new Promise((resolve, reject) => {
            this.$http<Usuario[]>({
                method: 'GET',
                url: `${this.serviceBase}api/accounts/usersByRole/`,
                params: {roleName:perfil}
            }).then<Usuario[]>(result => {
                resolve(result.data);
                return result.data;
            }, reason => reject(reason));
        });
    }
    changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.$http.post(this.serviceBase + 'api/accounts/changepassword', {
                oldPassword, newPassword, confirmPassword
            }).then(result => {
                resolve();
                return result;
            }, reason => reject(reason));
        });
        // POST api/accounts/changepassword void
    }
}

class MockUsuariosStore implements UsuariosStore {
    
    static usuarios: Usuario[] = [
        {
            "id": "123456",
            "email":"dtleonardo@hotmail.com",
            "firstName":"Dionisio",
            "lastName":"Leonardo",
            "roles": ["Administrador"]
        }
    ];
    
	getAll(): Promise<Usuario[]>{
        var usuarios = Array.prototype.slice.call(MockUsuariosStore.usuarios);
        return new Promise((resolve, reject) => resolve(usuarios));
    }
	getById(id: string): Promise<Usuario> {
        var usuario = MockUsuariosStore.usuarios.filter(u => u.id === id).shift();
        return new Promise((resolve, reject) => resolve(usuario));
    }
	save(entity: Usuario): Promise<string> {
        if (entity.id == null) {
            entity.id = (new Date().getTime()).toString();
            MockUsuariosStore.usuarios.push(entity);
        }
        return new Promise((resolve, reject) => resolve(entity.id));
    }
	remove(entity: Usuario): Promise<void> {
        var idx = MockUsuariosStore.usuarios.indexOf(entity);
        if (idx > -1) MockUsuariosStore.usuarios.splice(idx, 1);
        return new Promise<void>((resolve, reject) => resolve());
    }
    findByEmail(email: string): Promise<Usuario> {
        var usuario = MockUsuariosStore.usuarios.filter(u => u.email === email).shift();
        return new Promise((resolve, reject) => resolve(usuario));
    }
    findByPerfil(perfil: string): Promise<Usuario[]> {
        var usuarios = MockUsuariosStore.usuarios.filter(u => u.roles.indexOf(perfil) > -1 || u.roleName === perfil);
        return new Promise((resolve, reject) => resolve(usuarios));
    }
    changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
        return new Promise<void>((resolve, reject) => resolve());
    }
}