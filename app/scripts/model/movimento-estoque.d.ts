interface MovimentoEstoque {
	id?: number;
	produto?: Produto;
	idProduto?: number;
	quantidade?: number;
	data?: Date|string;
	observacao?: string;
}