import logger from '@common/logger';
import { InvalidOrderException } from '@exceptions/invalidOrderException';
import { Order } from '@models/order';
import { GetOrderByIdParams, UpdateOrderParams } from '@ports/input/orders';
import { CreateOrderResponse } from '@ports/output/orders';

export class OrderService {
	async getOrderCreatedById({ id }: GetOrderByIdParams): Promise<Order> {
		if (!id) {
			throw new InvalidOrderException('ID is required');
		}

		const orderFound: Order = {
			id,
			status: 'created',
			createdAt: new Date(),
			customerId: '123',
			updatedAt: new Date(),
		};

		return orderFound;
	}

	async updateOrder(order: UpdateOrderParams): Promise<CreateOrderResponse> {
		const updatedOrder: CreateOrderResponse = {
			id: order.id,
			status: order.status,
			createdAt: new Date(),
			customerId: '123',
			updatedAt: new Date(),
		};

		return updatedOrder;
	}

	async getOrderTotalValueById(id: string): Promise<number> {
		if (!id) {
			throw new InvalidOrderException(
				"Can't return order total value without providing a valid ID"
			);
		}

		return 0;
	}

	async getNumberOfValidOrdersToday(): Promise<number> {
		logger.info('Getting number of valid orders today');
		return 0;
		// return this.orderRepository.getNumberOfValidOrdersToday();
	}
}
