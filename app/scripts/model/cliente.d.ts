interface Cliente {
	id?: number;
	nome?: string;
	nascimento?: Date|string;
	documento?: string;
	email?: string;
	telefone?: string;
	nomeResponsavel?: string;
	telefoneResponsavel?: string;
	emailResponsavel?: string;
	responsavel?: Usuario;
    idResponsavel?: string;
	restricoes?: number[];
    saldo?: number;
}