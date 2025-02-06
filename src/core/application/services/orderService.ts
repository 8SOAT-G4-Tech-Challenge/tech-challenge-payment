import logger from '@common/logger';
import { InvalidOrderException } from '@exceptions/invalidOrderException';
import { InvalidProductException } from '@exceptions/invalidProductException';
import { Order } from '@models/order';
import { OrderItem } from '@models/orderItem';
import { ProductWithDetails } from '@models/product';
import { GetOrderByIdParams, UpdateOrderParams } from '@ports/input/orders';
import { CreateOrderResponse } from '@ports/output/orders';
import { OrderApiPort } from '@src/core/application/ports/output/orderApiPort';

export class OrderService {
	private readonly orderApiPort: OrderApiPort;

	constructor(orderApiPort: OrderApiPort) {
		this.orderApiPort = orderApiPort;
	}

	async getProductById(id: string): Promise<ProductWithDetails> {
		if (!id) {
			throw new InvalidProductException(
				'Must provide an product id to get product'
			);
		}

		logger.info('Fetching product from Order Microservice');

		return this.orderApiPort.getProductById(id);
	}

	async getAllCartItemsByOrderId(orderId: string): Promise<OrderItem[]> {
		if (!orderId) {
			throw new InvalidOrderException(
				'Must provide an order id to get order items'
			);
		}

		logger.info('Fetching order items from Order Microservice');

		return this.orderApiPort.getAllCartItemsByOrderId(orderId);
	}

	async getOrderCreatedById({ id }: GetOrderByIdParams): Promise<Order> {
		if (!id) {
			throw new InvalidOrderException('ID is required');
		}

		logger.info(`Fetching order via Order Microservice: ${id}`);

		return this.orderApiPort.getOrderCreatedById({ id });
	}

	async updateOrder(order: UpdateOrderParams): Promise<CreateOrderResponse> {
		if (!order?.id) {
			throw new InvalidOrderException(
				"Can't update order without providing an ID"
			);
		}

		logger.info(
			`Updating order via Order Microservice: ${JSON.stringify(order)}`
		);

		return this.orderApiPort.updateOrder(order);
	}

	async getOrderTotalValueById(id: string): Promise<number> {
		if (!id) {
			throw new InvalidOrderException(
				"Can't return order total value without providing a valid ID"
			);
		}

		const productItems = await this.getAllCartItemsByOrderId(id);

		if (!productItems.length) {
			throw new InvalidOrderException(
				"Can't return order total value without order items"
			);
		}

		const totalValue = productItems.reduce(
			(acc, productItem) => acc + productItem.value,
			0
		);

		logger.info(`Total value from order ${id} is ${totalValue}`);
		return totalValue;
	}

	async getNumberOfValidOrdersToday(): Promise<number> {
		logger.info('Getting number of valid orders today via Order Microservice');
		return this.orderApiPort.getNumberOfValidOrdersToday();
	}
}
