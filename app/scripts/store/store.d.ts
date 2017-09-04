
interface Store<T, TKey> {
	getAll(): Promise<T[]>;
	getById(id: TKey): Promise<T>;
	save(entity: T): Promise<TKey>; // tipo da pk
	remove(entity: T): Promise<void>;
}

interface ProdutosStore extends Store<Produto, number> {
	find(nome: string): Promise<Produto[]>;
}

interface ClientesStore extends Store<Cliente, number> {
	find(nome?: string, email?: string, documento?: string): Promise<Cliente[]>;
    getRestricoes(id: number): Promise<number[]>;
    addRestricao(idCliente: number, idProduto: number): Promise<void>;
    removeRestricao(idCliente: number, idProduto: number): Promise<void>;
}

interface VendasStore extends Store<Venda, number> {
    find(nome?: string, de?: Date, ate?: Date): Promise<Venda[]>;
}

interface UsuariosStore extends Store<Usuario, string> {
    findByEmail(email: string): Promise<Usuario>;
    findByPerfil(perfil: string): Promise<Usuario[]>;
    changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<void>;
}

interface MovimentosEstoqueStore extends Store<MovimentoEstoque, number> {
    getPage(page: number, pageSize: number): Promise<PagedResult<MovimentoEstoque>>;
}