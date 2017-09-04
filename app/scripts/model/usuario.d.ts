

interface Usuario {
	id?: string;
	firstName?: string;
    lastName?: string;
	email?: string;
	password?: string;
    confirmPassword?: string;
	clientes?: Cliente[];
	roles?: string[];
    roleName?: string;
}