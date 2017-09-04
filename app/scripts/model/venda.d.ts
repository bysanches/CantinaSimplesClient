
interface Venda {
    id?: number;
	cliente?: Cliente;
    idCliente?: number;
	formaPagamento?: string;
	itens?: ItemVenda[];
	total?: number;
    data?: Date;
}

interface ItemVenda {
    id?: number;
	produto?: Produto;
    idProduto?: number;
	quantidade?: number;
	preco?: number;
	subtotal?: number;
}