import { OrderApiImpl } from '@src/adapter/driven/external/OrderApiImpl';
import { OrderItemMockBuilder } from '@tests/mocks/order-item.mock-builder';
import { OrderMockBuilder } from '@tests/mocks/order.mock-builder';
import { ProductMockBuilder } from '@tests/mocks/product.mock-builder';

const mockedURL = 'http://localhost:3030';

const mockedAxios = {
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
};

const mockedIsAxiosError = jest.fn();

jest.mock('axios', () => ({
	...jest.requireActual('axios'),
	create: () => mockedAxios,
	isAxiosError: () => mockedIsAxiosError,
}));

describe('OrderApiImpl -> Test', () => {
	let client: OrderApiImpl;

	beforeEach(() => {
		client = new OrderApiImpl(mockedURL);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getAllCartItemsByOrderId', () => {
		test('should get all cart items by order ID', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();
			const orderItem = new OrderItemMockBuilder().withDefaultValues().build();

			mockedAxios.get.mockResolvedValue({ data: orderItem });

			const response = await client.getAllCartItemsByOrderId(order.id);

			expect(response).toEqual(orderItem);
		});

		test('should throw Error', async () => {
			mockedAxios.get.mockRejectedValue('');

			const rejectedFunction = async () => {
				await client.getAllCartItemsByOrderId('123');
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Unexpected error fetching cart items'
			);
		});

		test('should throw axios Error', async () => {
			mockedAxios.get.mockRejectedValue({
				response: { statusText: 'test' },
			});
			mockedIsAxiosError.mockReturnValue(true);

			const rejectedFunction = async () => {
				await client.getAllCartItemsByOrderId('123');
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Error fetching cart items: test'
			);
		});
	});

	describe('getProductById', () => {
		test('should get product ID', async () => {
			const product = new ProductMockBuilder().withDefaultValues().build();

			mockedAxios.get.mockResolvedValue({ data: product });

			const response = await client.getProductById(product.id);

			expect(response).toEqual(product);
		});

		test('should throw Error', async () => {
			mockedAxios.get.mockRejectedValue('');

			const rejectedFunction = async () => {
				await client.getProductById('123');
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Unexpected error fetching product'
			);
		});

		test('should throw axios Error', async () => {
			mockedAxios.get.mockRejectedValue({
				response: { statusText: 'test' },
			});
			mockedIsAxiosError.mockReturnValue(true);

			const rejectedFunction = async () => {
				await client.getProductById('123');
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Error fetching product: test'
			);
		});
	});

	describe('updateOrder', () => {
		test('should update order', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockedAxios.put.mockResolvedValue({ data: order });

			// @ts-expect-error typescript
			const response = await client.updateOrder(order);

			expect(response).toEqual(order);
		});

		test('should throw Error', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockedAxios.put.mockRejectedValue('');

			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await client.updateOrder(order);
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Unexpected error updating order'
			);
		});

		test('should throw axios Error', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockedAxios.put.mockRejectedValue({
				response: { statusText: 'test' },
			});
			mockedIsAxiosError.mockReturnValue(true);

			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await client.updateOrder(order);
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow('Error updating order: test');
		});
	});

	describe('getOrderCreatedById', () => {
		test('should get order created by ID', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockedAxios.get.mockResolvedValue({ data: order });

			const response = await client.getOrderCreatedById({ id: order.id });

			expect(response).toEqual(order);
		});

		test('should throw Error', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockedAxios.get.mockRejectedValue('');

			const rejectedFunction = async () => {
				await client.getOrderCreatedById(order);
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Unexpected error fetching order'
			);
		});

		test('should throw axios Error', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockedAxios.get.mockRejectedValue({
				response: { statusText: 'test' },
			});
			mockedIsAxiosError.mockReturnValue(true);

			const rejectedFunction = async () => {
				await client.getOrderCreatedById(order);
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow('Error fetching order: test');
		});
	});

	describe('getNumberOfValidOrdersToday', () => {
		test('should get number of valid orders today', async () => {
			mockedAxios.get.mockResolvedValue({ data: { count: 2 } });

			const response = await client.getNumberOfValidOrdersToday();

			expect(response).toEqual(2);
		});

		test('should throw Error', async () => {
			mockedAxios.get.mockRejectedValue('');

			const rejectedFunction = async () => {
				await client.getNumberOfValidOrdersToday();
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Unexpected error fetching order count'
			);
		});

		test('should throw axios Error', async () => {
			mockedAxios.get.mockRejectedValue({
				response: { statusText: 'test' },
			});
			mockedIsAxiosError.mockReturnValue(true);

			const rejectedFunction = async () => {
				await client.getNumberOfValidOrdersToday();
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Error fetching order count: test'
			);
		});
	});
});
