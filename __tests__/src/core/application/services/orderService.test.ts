import { InvalidOrderException } from '@src/core/application/exceptions/invalidOrderException';
import { InvalidProductException } from '@src/core/application/exceptions/invalidProductException';
import { OrderService } from '@src/core/application/services/orderService';
import logger from '@src/core/common/logger';
import { OrderMockBuilder } from '@tests/mocks/order.mock-builder';

describe('OrderService -> Test', () => {
	let service: OrderService;
	let orderApiAdapter: any;

	beforeEach(() => {
		orderApiAdapter = {
			getProductById: jest.fn(),
			getAllCartItemsByOrderId: jest.fn(),
			getOrderCreatedById: jest.fn(),
			updateOrder: jest.fn(),
			getNumberOfValidOrdersToday: jest.fn(),
		};

		service = new OrderService(orderApiAdapter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getProductById', () => {
		test('should get product by id', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const order = new OrderMockBuilder().withDefaultValues().build();

			(orderApiAdapter.getProductById as jest.Mock).mockResolvedValue(order);

			const response = await service.getProductById(order.id);

			expect(orderApiAdapter.getProductById).toHaveBeenCalledWith(order.id);
			expect(loggerSpy).toHaveBeenCalledWith(
				'[ORDER SERVICE] Fetching product from Order Microservice'
			);
			expect(response).toEqual(order);
		});

		test('should throw InvalidProductException', async () => {
			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.getProductById();
			};

			try {
				await rejectedFunction();
				fail('Expected InvalidProductException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidProductException);
				expect(error.message).toBe('Must provide an product id to get product');
				expect(error.statusCode).toBe(400);
			}
		});
	});

	describe('getAllCartItemsByOrderId', () => {
		test('should  get all cart items by order ID', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const order = new OrderMockBuilder().withDefaultValues().build();

			(orderApiAdapter.getAllCartItemsByOrderId as jest.Mock).mockResolvedValue(
				[order]
			);

			const response = await service.getAllCartItemsByOrderId(order.id);

			expect(orderApiAdapter.getAllCartItemsByOrderId).toHaveBeenCalledWith(
				order.id
			);
			expect(loggerSpy).toHaveBeenCalledWith(
				'[ORDER SERVICE] Fetching order items from Order Microservice'
			);
			expect(response).toEqual([order]);
		});

		test('should throw InvalidOrderException', async () => {
			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.getAllCartItemsByOrderId();
			};

			try {
				await rejectedFunction();
				fail('Expected InvalidOrderException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidOrderException);
				expect(error.message).toBe(
					'Must provide an order id to get order items'
				);
				expect(error.statusCode).toBe(400);
			}
		});
	});

	describe('getOrderCreatedById', () => {
		test('should get order created by ID', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const order = new OrderMockBuilder().withDefaultValues().build();

			(orderApiAdapter.getOrderCreatedById as jest.Mock).mockResolvedValue(
				order
			);

			const response = await service.getOrderCreatedById({ id: order.id });

			expect(orderApiAdapter.getOrderCreatedById).toHaveBeenCalledWith({
				id: order.id,
			});
			expect(loggerSpy).toHaveBeenCalledWith(
				`[ORDER SERVICE] Fetching order via Order Microservice: ${order.id}`
			);
			expect(response).toEqual(order);
		});

		test('should throw InvalidOrderException', async () => {
			const rejectedFunction = async () => {
				await service.getOrderCreatedById({});
			};

			try {
				await rejectedFunction();
				fail('Expected InvalidOrderException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidOrderException);
				expect(error.message).toBe('ID is required');
				expect(error.statusCode).toBe(400);
			}
		});
	});

	describe('updateOrder', () => {
		test('should update order', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const order = new OrderMockBuilder().withDefaultValues().build();

			(orderApiAdapter.updateOrder as jest.Mock).mockResolvedValue(order);

			// @ts-expect-error typescript
			const response = await service.updateOrder(order);

			expect(orderApiAdapter.updateOrder).toHaveBeenCalledWith(order);
			expect(loggerSpy).toHaveBeenCalledWith(
				`[ORDER SERVICE] Updating order via Order Microservice: ${JSON.stringify(
					order
				)}`
			);
			expect(response).toEqual(order);
		});

		test('should throw InvalidOrderException', async () => {
			const rejectedFunction = async () => {
				await service.updateOrder({});
			};

			try {
				await rejectedFunction();
				fail('Expected InvalidOrderException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidOrderException);
				expect(error.message).toBe(
					"Can't update order without providing an ID"
				);
				expect(error.statusCode).toBe(400);
			}
		});
	});

	describe('getNumberOfValidOrdersToday', () => {
		test('should get number of valid orders today', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			(
				orderApiAdapter.getNumberOfValidOrdersToday as jest.Mock
			).mockResolvedValue(2);

			await service.getNumberOfValidOrdersToday();

			expect(orderApiAdapter.getNumberOfValidOrdersToday).toHaveBeenCalled();
			expect(loggerSpy).toHaveBeenCalledWith(
				'[ORDER SERVICE] Getting number of valid orders today via Order Microservice'
			);
		});
	});
});
