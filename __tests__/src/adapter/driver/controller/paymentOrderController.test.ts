import { PaymentOrderController } from '@src/adapter/driver/controllers/paymentOrderController';
import logger from '@src/core/common/logger';
import { PaymentOrderMockBuilder } from '@tests/mocks/payment-order.mock-builder';

describe('PaymentOrderController -> Test', () => {
	let controller: PaymentOrderController;
	let paymentOrderService: any;

	beforeEach(() => {
		paymentOrderService = {
			getPaymentOrders: jest.fn(),
			getPaymentOrderById: jest.fn(),
			getPaymentOrderByOrderId: jest.fn(),
			makePayment: jest.fn(),
			processPaymentNotification: jest.fn(),
		};

		controller = new PaymentOrderController(paymentOrderService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getPaymentOrders', () => {
		test('should reply 200 and list all payment orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			const req = {};
			const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

			paymentOrderService.getPaymentOrders.mockResolvedValue([paymentOrder]);

			await controller.getPaymentOrders(req as any, reply as any);

			expect(reply.code).toHaveBeenCalledWith(200);
			expect(reply.send).toHaveBeenCalledWith([paymentOrder]);
			expect(loggerSpy).toHaveBeenCalledWith('Listing payment orders');
		});

		test('should fail to list payment orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'error');

			const req = { url: '/list-payment-orders-mock' };
			const reply = {
				send: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};

			paymentOrderService.getPaymentOrders.mockRejectedValue({
				message: 'error',
			});

			await controller.getPaymentOrders(req as any, reply as any);

			expect(loggerSpy).toHaveBeenCalledWith(
				'Unexpected error when listing for payment orders: {"message":"error"}'
			);
			expect(reply.status).toHaveBeenCalledWith(500);
			expect(reply.send).toHaveBeenCalledWith({
				message: 'error',
				path: '/list-payment-orders-mock',
				status: 500,
			});
		});
	});

	describe('getPaymentOrderById', () => {
		test('should reply 200 and list payment order', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			const req = { params: { id: '1' } };
			const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

			paymentOrderService.getPaymentOrderById.mockResolvedValue(paymentOrder);

			await controller.getPaymentOrderById(req as any, reply as any);

			expect(reply.code).toHaveBeenCalledWith(200);
			expect(reply.send).toHaveBeenCalledWith(paymentOrder);
			expect(loggerSpy).toHaveBeenCalledWith('Listing payment order by ID');
		});

		test('should reply 404', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const req = { params: { id: '1' } };
			const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

			paymentOrderService.getPaymentOrderById.mockResolvedValue();

			await controller.getPaymentOrderById(req as any, reply as any);

			expect(reply.code).toHaveBeenCalledWith(404);
			expect(reply.send).toHaveBeenCalledWith({
				error: 'Not Found',
				message: 'Payment Order with 1 not found',
			});
			expect(loggerSpy).toHaveBeenCalledWith('Listing payment order by ID');
		});

		test('should fail to list payment orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'error');

			const req = {
				params: { id: '1' },
				url: '/list-payment-orders-by-id-mock',
			};
			const reply = {
				send: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};

			paymentOrderService.getPaymentOrderById.mockRejectedValue({
				message: 'error',
			});

			await controller.getPaymentOrderById(req as any, reply as any);

			expect(loggerSpy).toHaveBeenCalledWith(
				'Unexpected error when listing for payment order: {"message":"error"}'
			);
			expect(reply.status).toHaveBeenCalledWith(500);
			expect(reply.send).toHaveBeenCalledWith({
				message: 'error',
				path: '/list-payment-orders-by-id-mock',
				status: 500,
			});
		});
	});

	describe('getPaymentOrderByOrderId', () => {
		test('should reply 200 and list payment order', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			const req = { params: { orderId: '1' } };
			const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

			paymentOrderService.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);

			await controller.getPaymentOrderByOrderId(req as any, reply as any);

			expect(reply.code).toHaveBeenCalledWith(200);
			expect(reply.send).toHaveBeenCalledWith(paymentOrder);
			expect(loggerSpy).toHaveBeenCalledWith(
				'Listing payment order by order ID'
			);
		});

		test('should reply 404', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const req = { params: { orderId: '1' } };
			const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

			paymentOrderService.getPaymentOrderByOrderId.mockResolvedValue();

			await controller.getPaymentOrderByOrderId(req as any, reply as any);

			expect(reply.code).toHaveBeenCalledWith(404);
			expect(reply.send).toHaveBeenCalledWith({
				error: 'Not Found',
				message: 'Payment Order with Order ID 1 not found',
			});
			expect(loggerSpy).toHaveBeenCalledWith(
				'Listing payment order by order ID'
			);
		});

		test('should fail to list payment orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'error');

			const req = {
				params: { orderId: '1' },
				url: '/list-payment-orders-by-order-id-mock',
			};
			const reply = {
				send: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};

			paymentOrderService.getPaymentOrderByOrderId.mockRejectedValue({
				message: 'error',
			});

			await controller.getPaymentOrderByOrderId(req as any, reply as any);

			expect(loggerSpy).toHaveBeenCalledWith(
				'Unexpected error when listing for payment order: {"message":"error"}'
			);
			expect(reply.status).toHaveBeenCalledWith(500);
			expect(reply.send).toHaveBeenCalledWith({
				message: 'error',
				path: '/list-payment-orders-by-order-id-mock',
				status: 500,
			});
		});
	});

	describe('makePayment', () => {
		test('should reply 201 and make payment', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			const req = { params: { orderId: '1' }, body: paymentOrder };
			const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

			paymentOrderService.makePayment.mockResolvedValue(paymentOrder);

			await controller.makePayment(req as any, reply as any);

			expect(reply.code).toHaveBeenCalledWith(200);
			expect(reply.send).toHaveBeenCalledWith(paymentOrder);
			expect(loggerSpy).toHaveBeenCalledWith('Making payment order');
		});

		test('should fail to list payment orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'error');

			const req = {
				params: { orderId: '1' },
				body: {},
				url: '/make-payment-orders-mock',
			};
			const reply = {
				send: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};

			paymentOrderService.makePayment.mockRejectedValue({
				message: 'error',
			});

			await controller.makePayment(req as any, reply as any);

			expect(loggerSpy).toHaveBeenCalledWith(
				'Unexpected error when making payment order: {"message":"error"}'
			);
			expect(reply.status).toHaveBeenCalledWith(500);
			expect(reply.send).toHaveBeenCalledWith({
				message: 'error',
				path: '/make-payment-orders-mock',
				status: 500,
			});
		});
	});

	describe('processPaymentNotification', () => {
		test('should reply 204 and process payment notification', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			const req = { body: paymentOrder };
			const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() };

			paymentOrderService.processPaymentNotification.mockResolvedValue(
				paymentOrder
			);

			await controller.processPaymentNotification(req as any, reply as any);

			expect(reply.code).toHaveBeenCalledWith(204);
			expect(reply.send).toHaveBeenCalled();
			expect(loggerSpy).toHaveBeenCalledWith(
				`Process notification payment order ${JSON.stringify(req.body)}`
			);
		});

		test('should fail to update payment orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'error');

			const req = {
				body: {},
				url: '/proccess-payment-orders-mock',
			};
			const reply = {
				send: jest.fn(),
				status: jest.fn().mockReturnThis(),
			};

			paymentOrderService.processPaymentNotification.mockRejectedValue({
				message: 'error',
			});

			await controller.processPaymentNotification(req as any, reply as any);

			expect(loggerSpy).toHaveBeenCalledWith(
				'Unexpected error when process notification payment order: {"message":"error"}'
			);
			expect(reply.status).toHaveBeenCalledWith(500);
			expect(reply.send).toHaveBeenCalledWith({
				message: 'error',
				path: '/proccess-payment-orders-mock',
				status: 500,
			});
		});
	});
});
