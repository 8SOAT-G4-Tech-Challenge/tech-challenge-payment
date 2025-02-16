import logger from '@common/logger';
import { InvalidOrderException } from '@exceptions/invalidOrderException';
import { InvalidProductException } from '@exceptions/invalidProductException';
import { Order } from '@models/order';
import { OrderItem } from '@models/orderItem';
import { ProductWithDetails } from '@models/product';
import { GetOrderByIdParams, UpdateOrderParams } from '@ports/input/orders';
import { CreateOrderResponse } from '@ports/output/orders';
import { OrderApi } from '@src/core/application/ports/output/orderApi';

export class OrderService {
	private readonly orderApi: OrderApi;

	constructor(orderApi: OrderApi) {
		this.orderApi = orderApi;
	}

	async getProductById(id: string): Promise<ProductWithDetails> {
		if (!id) {
			throw new InvalidProductException(
				'Must provide an product id to get product'
			);
		}

		logger.info('[ORDER SERVICE] Fetching product from Order Microservice');

		return this.orderApi.getProductById(id);
	}

	async getAllCartItemsByOrderId(orderId: string): Promise<OrderItem[]> {
		if (!orderId) {
			throw new InvalidOrderException(
				'Must provide an order id to get order items'
			);
		}

		logger.info('[ORDER SERVICE] Fetching order items from Order Microservice');

		return this.orderApi.getAllCartItemsByOrderId(orderId);
	}

	async getOrderCreatedById({ id }: GetOrderByIdParams): Promise<Order> {
		if (!id) {
			throw new InvalidOrderException('ID is required');
		}

		logger.info(`[ORDER SERVICE] Fetching order via Order Microservice: ${id}`);

		return this.orderApi.getOrderCreatedById({ id });
	}

	async updateOrder(order: UpdateOrderParams): Promise<CreateOrderResponse> {
		if (!order?.id) {
			throw new InvalidOrderException(
				"Can't update order without providing an ID"
			);
		}

		logger.info(
			`[ORDER SERVICE] Updating order via Order Microservice: ${JSON.stringify(
				order
			)}`
		);

		return this.orderApi.updateOrder(order);
	}

	async getNumberOfValidOrdersToday(): Promise<number> {
		logger.info(
			'[ORDER SERVICE] Getting number of valid orders today via Order Microservice'
		);
		return this.orderApi.getNumberOfValidOrdersToday();
	}
}
