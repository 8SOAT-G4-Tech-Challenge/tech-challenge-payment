import { ProductWithDetails } from '@models/product';

export class ProductService {
	async getProductById(id: string): Promise<ProductWithDetails> {
		const product: ProductWithDetails = {
			categoryId: '123',
			createdAt: new Date(),
			description: 'description',
			id,
			name: 'name',
			updatedAt: new Date(),
			value: 100,
		};
		return product;
	}
}
