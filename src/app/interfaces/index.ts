export interface IQuery {
	searchTerm?: string;
	page?: string;
	limit?: string;
	sortOrder?: string;
	sortBy?: string;

	//other filters to be added
	[key: string]: any;
}
