import { InvalidProductException } from '@application/exceptions/invalidProductException';
import logger from '@common/logger';
import { OrderItem } from '@models/orderItem';

export class CartService {
	async getAllCartItemsByOrderId(orderId: string): Promise<OrderItem[]> {
		if (!orderId) {
			throw new InvalidProductException(
				'Must provide an order id to get order items'
			);
		}

		logger.info('Searching all order items by order id');

		const orderItems: OrderItem[] = [];
		return orderItems;
		// return this.cartRepository.getAllCartItemsByOrderId(orderId);
	}
}
