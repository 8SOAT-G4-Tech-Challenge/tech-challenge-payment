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

			const rejectedFunction = async () => {
				await service.makePayment({ orderId: order.id });
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidPaymentOrderException);
			expect(rejectedFunction()).rejects.toThrow(
				`Order with id: ${order.id} not found`
			);
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

			const rejectedFunction = async () => {
				await service.makePayment({ orderId: order.id });
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidPaymentOrderException);
			expect(rejectedFunction()).rejects.toThrow(
				`Payment Order for the Order ID: ${order.id} already exists`
			);
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
			expect(loggerSpy).toHaveBeenCalledWith('Creating Payment Order');
			expect(response).toEqual(paymentOrder);
		});
	});

	describe('processPaymentNotification', () => {
		test('should throw PaymentNotificationException', async () => {
			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.processPaymentNotification({ state: 'status' });
			};

			expect(rejectedFunction()).rejects.toThrow(PaymentNotificationException);
			expect(rejectedFunction()).rejects.toThrow(
				'Invalid payment notification type status'
			);
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

			const rejectedFunction = async () => {
				await service.makePayment({ orderId: order.id });
			};

			expect(rejectedFunction()).rejects.toThrow(InvalidPaymentOrderException);
			expect(rejectedFunction()).rejects.toThrow(
				`Payment Order for the Order ID: ${order.id} already exists`
			);
		});

		test('should proccess finished orders and throw PaymentNotificationException', async () => {
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				undefined
			);

			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
			};

			expect(rejectedFunction()).rejects.toThrow(PaymentNotificationException);
			expect(rejectedFunction()).rejects.toThrow(
				`Error processing payment finish notification. Payment order ${notification.additional_info.external_reference} not found.`
			);
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

		test('should proccess finished orders and throw PaymentNotificationException', async () => {
			const paymentOrder = new PaymentOrderMockBuilder()
				.withDefaultValues()
				.build();
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				paymentOrder
			);

			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
			};

			expect(rejectedFunction()).rejects.toThrow(PaymentNotificationException);
			expect(rejectedFunction()).rejects.toThrow(
				`Error processing payment finish notification. Payment order ${notification.additional_info.external_reference} with status other than pending. Current status: ${paymentOrder.status}`
			);
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

			expect(loggerSpy).toHaveBeenCalledWith('Confirmation payment required');
		});

		test('should proccess cancelled orders and throw PaymentNotificationException when paymentOrder is not pending', async () => {
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

			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
			};

			expect(rejectedFunction()).rejects.toThrow(PaymentNotificationException);
			expect(rejectedFunction()).rejects.toThrow(
				`Error processing payment cancelation notification. Payment order ${notification.additional_info.external_reference} with status other than pending. Current status: ${paymentOrder.status}`
			);
		});

		test('should proccess cancelled orders and throw PaymentNotificationException', async () => {
			const notification = new PaymentNotificationMockBuilder()
				.withDefaultValues()
				.withState('CANCELED')
				.build();

			mockPaymentOrderRepository.getPaymentOrderByOrderId.mockResolvedValue(
				undefined
			);

			const rejectedFunction = async () => {
				// @ts-expect-error typescript
				await service.processPaymentNotification(notification);
			};

			expect(rejectedFunction()).rejects.toThrow(PaymentNotificationException);
			expect(rejectedFunction()).rejects.toThrow(
				`Error processing payment cancelation notification. Payment order ${notification.additional_info.external_reference} not found.`
			);
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
				`Order updated successfully: ${JSON.stringify(order)}`
			);
		});
	});
});
