interface Produto {
	id: number;
	nome: string;
	descricao?: string;
	preco: number;
	caminhoImagem?: string;
	restricoes?: Cliente[];
    saldo?: number;
}