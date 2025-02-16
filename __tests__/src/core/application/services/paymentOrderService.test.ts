import { PaymentNotificationStateEnum } from '@src/core/application/enumerations/paymentNotificationStateEnum';
import { InvalidPaymentOrderException } from '@src/core/application/exceptions/invalidPaymentOrderException';
import { PaymentNotificationException } from '@src/core/application/exceptions/paymentNotificationException';
import { PaymentOrderService } from '@src/core/application/services/paymentOrderService';
import logger from '@src/core/common/logger';
import { OrderMockBuilder } from '@tests/mocks/order.mock-builder';
import { PaymentNotificationMockBuilder } from '@tests/mocks/payment-notification.mock-builder';
import { PaymentOrderMockBuilder } from '@tests/mocks/payment-order.mock-builder';

describe('PaymentOrderService -> Test', () => {
	let service: PaymentOrderService;
	let mockPaymentOrderRepository: any;
	let orderService: any = jest.fn();
	let mercadoPagoService: any = jest.fn();

	beforeEach(() => {
		mockPaymentOrderRepository = {
			getPaymentOrders: jest.fn(),
			getPaymentOrderById: jest.fn(),
			getPaymentOrderByOrderId: jest.fn(),
			createPaymentOrder: jest.fn(),
			updatePaymentOrder: jest.fn(),
		};

		orderService = {
			updateOrder: jest.fn(),
			getOrderTotalValueById: jest.fn(),
			getOrderCreatedById: jest.fn(),
			getNumberOfValidOrdersToday: jest.fn(),
		};

		mercadoPagoService = {
			createQrPaymentRequest: jest.fn(),
		};

		service = new PaymentOrderService(
			mockPaymentOrderRepository,
			mercadoPagoService,
			orderService
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getPaymentOrders', () => {
		test('should get all payment orders', async () => {
			const paymentOrders = [
				new PaymentOrderMockBuilder().withDefaultValues().build(),
				new PaymentOrderMockBuilder().withDefaultValues().build(),
				new PaymentOrderMockBuilder().withDefaultValues().build(),
			];

			mockPaymentOrderRepository.getPaymentOrders.mockResolvedValue(
				paymentOrders
			);

			const response = await service.getPaymentOrders();

			expect(mockPaymentOrderRepository.getPaymentOrders).toHaveBeenCalled();
			expect(response).toEqual(paymentOrders);
		});
	});

	describe('getPaymentOrderById', () => {
		test('should get payment order by payment order ID', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			mockPaymentOrderRepository.getPaymentOrderById.mockResolvedValue(
				paymentOrder
			);

			const response = await service.getPaymentOrderById({
				id: paymentOrder.id,
			});

			expect(
				mockPaymentOrderRepository.getPaymentOrderById
			).toHaveBeenCalledWith({ id: paymentOrder.id });
			expect(response).toEqual(paymentOrder);
		});
	});

	describe('getPaymentOrderByOrderId', () => {
		test('should get payment order by order ID', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);

			const response = await service.getPaymentOrderByOrderId({
				orderId: order.id,
			});

			expect(
				mockPaymentOrderRepository.getPaymentOrderByOrderId
			).toHaveBeenCalledWith({ orderId: order.id });
			expect(response).toEqual(paymentOrder);
		});
	});

	describe('makePayment', () => {
		test('should throw InvalidPaymentOrderException', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();

			orderService.getOrderCreatedById.mockResolvedValue(undefined);

			try {
				await service.makePayment({ orderId: order.id });
				fail('Expected InvalidPaymentOrderException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidPaymentOrderException);
				expect(error.message).toBe(`Order with id: ${order.id} not found`);
				expect(error.statusCode).toBe(400);
			}
		});

		test('should throw InvalidPaymentOrderException when payment order already exists', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			orderService.getOrderCreatedById.mockResolvedValue(order);
			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);

			try {
				await service.makePayment({ orderId: order.id });
				fail('Expected InvalidPaymentOrderException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidPaymentOrderException);
				expect(error.message).toBe(
					`Payment Order for the Order ID: ${order.id} already exists`
				);
				expect(error.statusCode).toBe(400);
			}
		});

		test('should create payment order', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const order = new OrderMockBuilder().withDefaultValues().build();
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			orderService.getOrderCreatedById.mockResolvedValue(order);
			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				undefined
			);
			mercadoPagoService.createQrPaymentRequest.mockResolvedValue({
				qrData: '00020101021126510014BR.GOV.BCB.PIX',
			});
			mockPaymentOrderRepository.createPaymentOrder.mockResolvedValue(
				paymentOrder
			);

			const response = await service.makePayment({
				orderId: order.id,
			});

			expect(
				mockPaymentOrderRepository.getPaymentOrderByOrderId
			).toHaveBeenCalledWith({ orderId: order.id });
			expect(loggerSpy).toHaveBeenCalledWith(
				'[PAYMENT ORDER SERVICE] Creating Payment Order'
			);
			expect(response).toEqual(paymentOrder);
		});
	});

	describe('processPaymentNotification', () => {
		test('should throw PaymentNotificationException', async () => {
			try {
				// @ts-expect-error typescript
				await service.processPaymentNotification({ state: 'status' });
				fail('Expected PaymentNotificationException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(PaymentNotificationException);
				expect(error.message).toBe('Invalid payment notification type status');
				expect(error.statusCode).toBe(400);
			}
		});

		test('should throw InvalidPaymentOrderException when payment order already exists', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();

			orderService.getOrderCreatedById.mockResolvedValue(order);
			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);

			try {
				await service.makePayment({ orderId: order.id });
				fail('Expected InvalidPaymentOrderException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(InvalidPaymentOrderException);
				expect(error.message).toBe(
					`Payment Order for the Order ID: ${order.id} already exists`
				);
				expect(error.statusCode).toBe(400);
			}
		});

		test('should process finished orders and throw PaymentNotificationException', async () => {
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				undefined
			);

			try {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
				fail('Expected PaymentNotificationException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(PaymentNotificationException);
				expect(error.message).toBe(
					`Error processing payment finish notification. Payment order ${notification.additional_info.external_reference} not found.`
				);
				expect(error.statusCode).toBe(400);
			}
		});

		test('should proccess finished orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.withStatus('pending')
				.build();
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.build();
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);
			mockPaymentOrderRepository.updatePaymentOrder.mockResolvedValue({
				...paymentOrder,
				status: 'approved',
			});
			orderService.updateOrder.mockResolvedValue(order);

			// @ts-expect-error typescript
			await service.processPaymentNotification(notification);

			expect(loggerSpy).toHaveBeenCalledWith(
				`Order updated successfully: ${JSON.stringify(order)}`
			);
		});

		test('should process finished orders and throw PaymentNotificationException', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);

			try {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
				fail('Expected PaymentNotificationException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(PaymentNotificationException);
				expect(error.message).toBe(
					`Error processing payment finish notification. Payment order ${notification.additional_info.external_reference} with status other than pending. Current status: ${paymentOrder.status}`
				);
				expect(error.statusCode).toBe(400);
			}
		});

		test('should proccess finished orders when is the first order of the day', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.withStatus('pending')
				.build();
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.build();
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);
			mockPaymentOrderRepository.updatePaymentOrder.mockResolvedValue({
				...paymentOrder,
				status: 'approved',
			});
			orderService.updateOrder.mockResolvedValue(order);
			orderService.getNumberOfValidOrdersToday.mockResolvedValue(1);

			// @ts-expect-error typescript
			await service.processPaymentNotification(notification);

			expect(loggerSpy).toHaveBeenCalledWith(
				`Order updated successfully: ${JSON.stringify(order)}`
			);
		});

		test('should proccess confirmation required order', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.build();

			// @ts-expect-error typescript
			await service.processPaymentNotification({
				...notification,
				state: PaymentNotificationStateEnum.CONFIRMATION_REQUIRED,
			});

			expect(loggerSpy).toHaveBeenCalledWith(
				'[PAYMENT ORDER SERVICE] Confirmation payment required'
			);
		});

		test('should process cancelled orders and throw PaymentNotificationException when paymentOrder is not pending', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.withStatus('approved')
				.build();
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.withState('CANCELED')
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);

			try {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
				fail('Expected PaymentNotificationException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(PaymentNotificationException);
				expect(error.message).toBe(
					`Error processing payment cancelation notification. Payment order ${notification.additional_info.external_reference} with status other than pending. Current status: ${paymentOrder.status}`
				);
				expect(error.statusCode).toBe(400);
			}
		});

		test('should process cancelled orders and throw PaymentNotificationException', async () => {
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.withState('CANCELED')
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				undefined
			);

			try {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
				fail('Expected PaymentNotificationException but no error was thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(PaymentNotificationException);
				expect(error.message).toBe(
					`Error processing payment cancelation notification. Payment order ${notification.additional_info.external_reference} not found.`
				);
				expect(error.statusCode).toBe(400);
			}
		});

		test('should proccess cancelled orders', async () => {
			const loggerSpy = jest.spyOn(logger, 'info');

			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.withStatus('pending')
				.build();
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.withState('CANCELED')
				.build();
			const order = new OrderMockBuilder().withDefaultValues().build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);
			mockPaymentOrderRepository.updatePaymentOrder.mockResolvedValue({
				...paymentOrder,
				status: 'pending',
			});
			orderService.updateOrder.mockResolvedValue(order);

			// @ts-expect-error typescript
			await service.processPaymentNotification(notification);

			expect(loggerSpy).toHaveBeenCalledWith(
				`[PAYMENT ORDER SERVICE] Order updated successfully: ${JSON.stringify(
					order
				)}`
			);
		});
	});
});
