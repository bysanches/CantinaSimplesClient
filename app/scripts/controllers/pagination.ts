
interface PagedResult<T> {
    data: T[];
    totalCount: number;
}

class Paginator {
    public page: number;
    public pageSize: number;
    public totalCount: number;
    
    constructor() {
        this.page = 1;
        this.pageSize = 10;
        this.totalCount = 0;
    }
    
	pageCount() {
		return Math.ceil(this.totalCount / this.pageSize);
	}
	
	hasNextPage() {
		return this.page < this.pageCount();
	}
	
	nextPage() {
		if (this.hasNextPage()) {
			this.page++;
		}
	}
	
	hasPreviousPage() {
		return this.page > 1;
	}
	
	previousPage() {
		if (this.hasPreviousPage()) {
			this.page--;
		}
	}
}

app.service('paginator', Paginator);

class LocalPaginationController<T> {
	public page: number;
	public pageSize: number;
	public items: T[];
	
	constructor() {
		this.page = 1;
		this.pageSize = 10;
		this.items = [];
	}
	
	pagedResult(items: T[]): T[] {
		this.items = items || [];
		let start = (this.page - 1) * this.pageSize;
		return items.slice(start, start + this.pageSize);
	}
	
	pageCount() {
		return Math.ceil(this.items.length / this.pageSize);
	}
	
	hasNextPage() {
		return this.page < this.pageCount();
	}
	
	nextPage() {
		if (this.hasNextPage()) {
			this.page++;
		}
	}
	
	hasPreviousPage() {
		return this.page > 1;
	}
	
	previousPage() {
		if (this.hasPreviousPage()) {
			this.page--;
		}
	}
}

angular.module('cantinaSimplesClienteApp')
	.controller('LocalPaginationController', LocalPaginationController);