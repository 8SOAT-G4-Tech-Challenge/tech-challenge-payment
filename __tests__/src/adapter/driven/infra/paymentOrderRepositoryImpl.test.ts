import { prisma } from '@src/adapter/driven/infra/lib/prisma';
import { PaymentOrderRepositoryImpl } from '@src/adapter/driven/infra/paymentOrderRepositoryImpl';
import { PaymentOrderMockBuilder } from '@tests/mocks/payment-order.mock-builder';

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('PaymentOrderRepositoryImpl -> Test', () => {
	let repository: PaymentOrderRepositoryImpl;

	beforeEach(() => {
		repository = new PaymentOrderRepositoryImpl();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getPaymentOrders', () => {
		test('should get payment orders', async () => {
			const paymentOrders = [
				new PaymentOrderMockBuilder().withDefaultValues().build(),
			];

			jest
				.spyOn(prisma.paymentOrder, 'findMany')
				.mockResolvedValue(paymentOrders as any);

			const response = await repository.getPaymentOrders();

			expect(response).toEqual(paymentOrders);
		});
	});

	describe('getPaymentOrderById', () => {
		test('should get payment order by ID', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			jest
				.spyOn(prisma.paymentOrder, 'findUnique')
				.mockResolvedValue(paymentOrder as any);

			const response = await repository.getPaymentOrderById({
				id: paymentOrder.id,
			});

			expect(response).toEqual(paymentOrder);
		});

		test('should get payment order by ID and return null', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			jest.spyOn(prisma.paymentOrder, 'findUnique').mockResolvedValue(null);

			const response = await repository.getPaymentOrderById({
				id: paymentOrder.id,
			});

			expect(response).toEqual(null);
		});
	});

	describe('getPaymentOrderByOrderId', () => {
		test('should get payment order by order ID', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			jest
				.spyOn(prisma.paymentOrder, 'findUnique')
				.mockResolvedValue(paymentOrder as any);

			const response = await repository.getPaymentOrderByOrderId({
				orderId: paymentOrder.id,
			});

			expect(response).toEqual(paymentOrder);
		});

		test('should get payment order by order ID and return null', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			jest.spyOn(prisma.paymentOrder, 'findUnique').mockResolvedValue(null);

			const response = await repository.getPaymentOrderByOrderId({
				orderId: paymentOrder.id,
			});

			expect(response).toEqual(null);
		});
	});

	describe('createPaymentOrder', () => {
		test('should create payment order', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			jest
				.spyOn(prisma.paymentOrder, 'create')
				.mockResolvedValue(paymentOrder as any);

			const response = await repository.createPaymentOrder(paymentOrder as any);

			expect(response).toEqual(paymentOrder);
		});
	});

	describe('updatePaymentOrder', () => {
		test('should create payment order', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			jest
				.spyOn(prisma.paymentOrder, 'update')
				.mockResolvedValue(paymentOrder as any);

			const response = await repository.updatePaymentOrder(paymentOrder as any);

			expect(response).toEqual(paymentOrder);
		});
	});
});
