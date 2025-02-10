import { InvalidOrderException } from '@src/core/application/exceptions/invalidOrderException';
import { InvalidProductException } from '@src/core/application/exceptions/invalidProductException';
import { OrderService } from '@src/core/application/services/orderService';
import logger from '@src/core/common/logger';
import { OrderMockBuilder } from '@tests/mocks/order.mock-builder';
import { ProductMockBuilder } from '@tests/mocks/product.mock-builder';

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
				'Fetching product from Order Microservice'
			);
			expect(response).toEqual(order);
		});

		test('should throw InvalidProductException', async () => {
			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.getProductById();
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidProductException);
			expect(rejectedFunction()).rejects.toThrow(
				'Must provide an product id to get product'
			);
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
				'Fetching order items from Order Microservice'
			);
			expect(response).toEqual([order]);
		});

		test('should throw InvalidOrderException', async () => {
			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.getAllCartItemsByOrderId();
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidOrderException);
			expect(rejectedFunction()).rejects.toThrow(
				'Must provide an order id to get order items'
			);
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
				`Fetching order via Order Microservice: ${order.id}`
			);
			expect(response).toEqual(order);
		});

		test('should throw InvalidOrderException', async () => {
			const rejectedFunction = async () => {
				await service.getOrderCreatedById({});
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidOrderException);
			expect(rejectedFunction()).rejects.toThrow('ID is required');
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
				`Updating order via Order Microservice: ${JSON.stringify(order)}`
			);
			expect(response).toEqual(order);
		});

		test('should throw InvalidOrderException', async () => {
			const rejectedFunction = async () => {
				await service.updateOrder({});
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidOrderException);
			expect(rejectedFunction()).rejects.toThrow(
				"Can't update order without providing an ID"
			);
		});
	});

	describe('getOrderTotalValueById', () => {
		test('should order total value by ID', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const order = new OrderMockBuilder().withDefaultValues().build();
			const product = new ProductMockBuilder().withDefaultValues().build();

			(orderApiAdapter.getAllCartItemsByOrderId as jest.Mock).mockResolvedValue(
				[product]
			);

			const response = await service.getOrderTotalValueById(order.id);

			expect(orderApiAdapter.getAllCartItemsByOrderId).toHaveBeenCalledWith(
				order.id
			);
			expect(loggerSpy).toHaveBeenCalledWith(
				`Total value from order ${order.id} is 99.99`
			);
			expect(response).toEqual(99.99);
		});

		test('should throw InvalidOrderException', async () => {
			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.getOrderTotalValueById();
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidOrderException);
			expect(rejectedFunction()).rejects.toThrow(
				"Can't return order total value without providing a valid ID"
			);
		});

		test('should throw invalid order value InvalidOrderException', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			(orderApiAdapter.getAllCartItemsByOrderId as jest.Mock).mockResolvedValue(
				[]
			);

			const rejectedFunction = async () => {
				await service.getOrderTotalValueById(order.id);
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidOrderException);
			expect(rejectedFunction()).rejects.toThrow(
				"Can't return order total value without order items"
			);
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
				'Getting number of valid orders today via Order Microservice'
			);
		});
	});
});
